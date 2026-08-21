import { Artifact, ArtifactType } from '@/types';

interface ParseResult {
    text: string;           // clean text without artifact tags, think blocks, or skill calls
    artifacts: Artifact[];  // extracted artifacts (both complete and streaming)
    isComplete: boolean;    // true when all open tags are fully closed
    activeSkill: string | null; // active skill name if invoked
}

const SKILL_LABELS: Record<string, string> = {
    'frontend-design': 'Frontend Design Skill',
    'presentation-design': 'Presentation Skill',
    'document-authoring': 'Document Skill',
    'code-engineering': 'Code Engineering Skill',
    'web-search': 'Search Retrieval Skill',
};

// Call this on the FULL accumulated response string as it streams
export function parseArtifacts(raw: string, isStreamFinal: boolean = false): ParseResult {
    const artifacts: Artifact[] = [];
    let text = raw;
    let activeSkill: string | null = null;

    // 1. Strip reasoning blocks safely without swallowing arbitrary code or template tags
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    text = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '');
    text = text.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '');

    // 1b. Strip orphaned closing </think> or </thought> tags where the model omitted the opening tag
    if (text.includes('</think>')) {
        text = text.replace(/^[\s\S]*?<\/think>\s*/i, '');
    }
    if (text.includes('</thought>')) {
        text = text.replace(/^[\s\S]*?<\/thought>\s*/i, '');
    }
    if (text.includes('</reasoning>')) {
        text = text.replace(/^[\s\S]*?<\/reasoning>\s*/i, '');
    }

    if (!isStreamFinal) {
        // If an in-flight think tag is still actively streaming at the end of the text
        text = text.replace(/<think>[\s\S]*$/gi, '');
        text = text.replace(/<thought>[\s\S]*$/gi, '');
        text = text.replace(/<reasoning>[\s\S]*$/gi, '');
    } else {
        // If stream ended with an unclosed <think> tag:
        // Strip the opening tag so that if the model put actual response text after/inside <think>, it is NOT hidden
        if (/<think>/i.test(text)) {
            const thinkIndex = text.search(/<think>/i);
            const afterThink = text.slice(thinkIndex).replace(/<think>/i, '').trim();
            const beforeThink = text.slice(0, thinkIndex).trim();
            text = (beforeThink ? beforeThink + '\n\n' : '') + afterThink;
        }
        text = text.replace(/<thought>/gi, '').replace(/<reasoning>/gi, '');
    }

    text = text.trim();

    // 1c. Strip leading model thinking headers like "Titan Pro Thinking", "Thinking with...", "Thinking:"
    text = text.replace(/^(?:Titan (?:Pro|Ultra)(?: Thinking)?\s*|\*?Thinking(?: with [^\n]+)?:?\*?\s*)+/gi, '').trim();

    // 2. Detect and strip <skill_call name="..."> tags
    const skillMatch = text.match(/<skill(?:_call)?\s+name="([^"]+)"[^>]*>(?:<\/skill(?:_call)?>)?/i);
    if (skillMatch) {
        const rawSkillId = skillMatch[1].toLowerCase().trim();
        activeSkill = SKILL_LABELS[rawSkillId] || `${rawSkillId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Skill`;
        text = text.replace(skillMatch[0], '').trim();
    }

    // 3. Extract and replace all fully closed <artifact ...>...</artifact> tags (tolerant to single quotes, double quotes, unquoted attributes, spaces)
    const closedArtifactRegex = /<artifact\s+type=["']?([^"'\s>]+)["']?(?:\s+language=["']?([^"'\s>]+)["']?)?(?:\s+title=["']?([^"'>]+)["']?)?[^>]*>([\s\S]*?)<\/artifact>/gi;
    
    text = text.replace(closedArtifactRegex, (_fullMatch, type, language, title, content) => {
        const id = `artifact-${artifacts.length}`;
        artifacts.push({
            id,
            type: (type as ArtifactType) || 'html',
            title: title ? title.trim() : `Artifact ${artifacts.length + 1}`,
            language: language ? language.trim() : undefined,
            description: `${(type || 'code').toUpperCase()} file`,
            content: content.trim(),
            isGenerating: false,
        });
        return '';
    });

    // 4. Check for in-progress (unclosed) <artifact ...> tag currently streaming or cut off midway
    const openArtifactMatch = text.match(/<artifact\s+type=["']?([^"'\s>]+)["']?(?:\s+language=["']?([^"'\s>]+)["']?)?(?:\s+title=["']?([^"'>]+)["']?)?[^>]*>([\s\S]*)$/i);
    let isComplete = true;

    if (openArtifactMatch) {
        isComplete = isStreamFinal;
        const [fullOpenMatch, type, language, title, partialContent] = openArtifactMatch;
        const id = `artifact-${artifacts.length}`;

        artifacts.push({
            id,
            type: (type as ArtifactType) || 'html',
            title: title ? title.trim() : 'Interactive Project',
            language: language ? language.trim() : undefined,
            description: isStreamFinal ? `${(type || 'code').toUpperCase()} file` : `Generating ${(type || 'code').toUpperCase()}...`,
            content: partialContent.trim(),
            isGenerating: !isStreamFinal,
        });

        // If stream is final and tag was left open, clean the opening XML wrapper from visible text
        if (isStreamFinal) {
            text = text.replace(/<artifact\s+type=["']?([^"'\s>]+)["']?(?:\s+language=["']?([^"'\s>]+)["']?)?(?:\s+title=["']?([^"'>]+)["']?)?[^>]*>/i, '');
        } else {
            // Strip the unclosed artifact block from display text only during active streaming so raw XML wrapper doesn't flicker
            text = text.replace(fullOpenMatch, '');
        }
    } else if (/<artifact\b/i.test(text)) {
        // Tag is opening without full header yet
        isComplete = isStreamFinal;
        if (!isStreamFinal) {
            text = text.replace(/<artifact[\s\S]*$/i, '');
        } else {
            text = text.replace(/<artifact\b[^>]*>/gi, '');
        }
    }

    // 5. Fallback Auto-Detection ONLY for standalone full-document HTML at root level (not within markdown ``` blocks)
    const isInsideMarkdownCode = (text.match(/```/g) || []).length % 2 === 1;
    if (artifacts.length === 0 && !isInsideMarkdownCode && text.startsWith('<!DOCTYPE html>')) {
        const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'Interactive Application';
        const hasClosingTag = text.includes('</html>');

        artifacts.push({
            id: 'artifact-0',
            type: 'html',
            title: title,
            description: isStreamFinal || hasClosingTag ? 'HTML Application' : 'Generating HTML...',
            content: text.trim(),
            isGenerating: !(isStreamFinal || hasClosingTag),
        });

        text = '';
        isComplete = hasClosingTag || isStreamFinal;
    }

    // 6. Graceful Code Block Auto-Balancing on Stream Completion
    // If stream ended with an unclosed code block, balance it so syntax highlighting and markdown display cleanly
    if (isStreamFinal && text) {
        const backtickMatches = text.match(/```/g) || [];
        if (backtickMatches.length % 2 === 1) {
            text = text + '\n```';
        }
    }

    return { text: text.trim(), artifacts, isComplete, activeSkill };
}

// Tool call detector: returns query string or null
export function detectToolCall(text: string): string | null {
    const match = text.match(/<tool_call>\s*\{"name"\s*:\s*"web_search"\s*,\s*"arguments"\s*:\s*\{"query"\s*:\s*"([^"]+)"\s*\}\s*\}\s*<\/tool_call>/);
    return match ? match[1] : null;
}

export function isResponseTruncated(raw: string): boolean {
    if (!raw || raw.trim().length < 5) return false;
    const trimmed = raw.trim();
    
    // 1. Odd number of code fences
    const fenceCount = (trimmed.match(/```/g) || []).length;
    if (fenceCount % 2 === 1) return true;

    // 2. Unclosed HTML/XML artifact tags
    if (/<artifact\b[^>]*>(?:(?!<\/artifact>)[\s\S])*$/i.test(trimmed)) return true;

    // 3. Ends with trailing unclosed operators, parens, or cut off keywords
    const endsWithCutoff = /(=|\+|\-|\*|\/|,|\(|\[|\{|\b(?:return|if|else|for|while|const|let|var|int|float|double|char|void|def|class|function|struct|switch|case|import|export|from|include|printf|scanf|malloc|free|cout|cin|inOrder|preOrder|postOrder)\s*)$/i.test(trimmed);
    if (endsWithCutoff) return true;

    // 4. Check if last code block is unclosed or ends without proper statement termination
    const codeBlockMatches = trimmed.match(/```[a-zA-Z0-9_-]*\n([\s\S]*?)(?:```|$)/g);
    if (codeBlockMatches && codeBlockMatches.length > 0) {
        const lastBlock = codeBlockMatches[codeBlockMatches.length - 1];
        if (!lastBlock.endsWith('```')) {
            const blockTrimmed = lastBlock.trim();
            if (!/[;}\)>]$/.test(blockTrimmed)) {
                return true;
            }
        }
    }

    return false;
}

