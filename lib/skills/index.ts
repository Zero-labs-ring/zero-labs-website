import { FRONTEND_DESIGN_SKILL } from './frontendDesign';
import { CODE_ENGINEERING_SKILL } from './codeEngineering';
import { PRESENTATION_DESIGN_SKILL } from './presentationDesign';
import { DOCUMENT_AUTHORING_SKILL } from './documentAuthoring';

export interface SkillDefinition {
    id: string;
    name: string;
    description: string;
    instruction: string;
    triggers: RegExp[];
}

export const SKILL_REGISTRY: Record<string, SkillDefinition> = {
    'frontend-design': {
        id: 'frontend-design',
        name: 'Universal Frontend & UI Design',
        description: 'Designs and builds any modern, responsive single-file web application, SaaS UI, dashboard, 2D/3D game, simulation, or interactive tool.',
        instruction: FRONTEND_DESIGN_SKILL,
        triggers: [
            /html/i,
            /frontend/i,
            /ui|ux/i,
            /website|webpage|page/i,
            /app|web app|application/i,
            /dashboard|analytics|portal/i,
            /game|canvas|simulation/i,
            /three\.?js|webgl|graphic/i,
            /css|tailwind|style/i,
            /landing page|portfolio|calculator|editor|tool|widget/i,
        ],
    },
    'code-engineering': {
        id: 'code-engineering',
        name: 'Code Engineering',
        description: 'Generates full runnable software programs, TypeScript/React components, API handlers, and algorithms without truncation.',
        instruction: CODE_ENGINEERING_SKILL,
        triggers: [
            /code|coding|program|script|implement|function|algorithm|class|method|struct/i,
            /typescript|javascript|python|rust|go|golang|c\+\+|cpp|\bc\b|java|csharp|php|ruby|swift|kotlin/i,
            /react|tsx|jsx|component|hook|nextjs|vue|svelte/i,
            /api|backend|database|sql|query|endpoint|server|route/i,
            /debug|fix|refactor|error|bug|optimize|solve|data structure|tree|graph|list|sort/i,
        ],
    },
    'presentation-design': {
        id: 'presentation-design',
        name: 'Presentation & Deck Design',
        description: 'Designs professional slide decks with structured JSON slides for PowerPoint (.pptx).',
        instruction: PRESENTATION_DESIGN_SKILL,
        triggers: [
            /presentation/i,
            /slide/i,
            /deck/i,
            /powerpoint|pptx/i,
            /pitch deck/i,
        ],
    },
    'document-authoring': {
        id: 'document-authoring',
        name: 'Document Authoring',
        description: 'Writes comprehensive markdown reports, technical specifications, structured documents, PDF files, and Excel spreadsheets.',
        instruction: DOCUMENT_AUTHORING_SKILL,
        triggers: [
            /document/i,
            /report/i,
            /markdown|\.md/i,
            /doc|docx/i,
            /specification|guide/i,
            /pdf/i,
            /readme/i,
            /write.*file/i,
            /file.*pdf/i,
            /excel|xlsx|spreadsheet/i,
            /csv|table.*data|data.*table/i,
            /sheet|workbook/i,
        ],
    },
};

/**
 * Base system prompt with ChatGPT/Claude style conversation flow
 */
export const BASE_SYSTEM_PROMPT = `
You are Titan, a high-performance AI coding and research model by Zero Labs with 128K token context capacity.

## Core Directives:
1. **CRITICAL: No Internal Reasoning Output**: Never output <think>, <thought>, <reasoning> tags or any "Thinking Process" / "Let me analyze" preamble in your response. These waste tokens and cause stream timeouts. Begin directly with your answer.
2. **Direct, Instant Solutions**: Jump directly into the solution. No filler preamble or repetitive pleasantries.
3. **100% Complete & Un-Truncated Code**: Always provide the full, complete, production-ready implementation inside standard markdown code blocks with explicit language identifiers (\`\`\`python, \`\`\`c, \`\`\`cpp, \`\`\`typescript, \`\`\`javascript, \`\`\`java, \`\`\`html, \`\`\`sql, etc.). Never truncate, omit functions, or leave placeholder comments like \`// ... rest of code\`.
4. **Data Visualizations & Charts**: When the user requests a chart, graph, or dashboard, provide the complete, runnable code with full datasets and proper configurations (using Chart.js, Recharts, SVG, or Canvas).
5. **Standalone Interactive Apps**: For standalone interactive visual web applications or games, wrap them in:
<artifact type="html" title="App Title">
<!DOCTYPE html><html>...</html>
</artifact>
6. **Slide Decks & Presentations**: Use:
<artifact type="pptx" title="Deck Title">
[
  {"title": "Slide 1 Title", "content": ["bullet 1", "bullet 2"], "notes": "speaker notes", "bg": "#0f172a"},
  {"title": "Slide 2 Title", "content": ["bullet 1", "bullet 2"], "bg": "#1e1b4b"}
]
</artifact>
7. **PDF Documents & Reports**: Wrap the content in:
<artifact type="pdf" title="Descriptive Title">
# Title
## Section
Content here...
</artifact>
8. **Excel Spreadsheets**: Wrap full CSV data in:
<artifact type="xlsx" title="Descriptive Sheet Title">
Column1,Column2,Column3
value1,value2,value3
</artifact>
9. Never output raw internal reasoning tags or unclosed XML.
`.trim();

/**
 * Dynamically resolves and loads skills on demand based on conversation context.
 */
export function resolveSkillsForContext(messages: { role: string; content: string }[]): string[] {
    const activeSkillIds = new Set<string>();
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // Check triggers on the most recent user request
    for (const [skillId, skill] of Object.entries(SKILL_REGISTRY)) {
        for (const trigger of skill.triggers) {
            if (trigger.test(lastUserMsg)) {
                activeSkillIds.add(skillId);
                break;
            }
        }
    }

    // Default to frontend-design for any visual/interactive intent if no specific skill matched
    if (activeSkillIds.size === 0 && (lastUserMsg.includes('create') || lastUserMsg.includes('generate') || lastUserMsg.includes('build'))) {
        activeSkillIds.add('frontend-design');
    }

    return Array.from(activeSkillIds);
}

/**
 * Constructs the targeted dynamic system prompt with only the relevant skills loaded.
 */
export function buildDynamicSystemPrompt(messages: { role: string; content: string }[]): string {
    const matchedSkillIds = resolveSkillsForContext(messages);

    if (matchedSkillIds.length === 0) {
        return BASE_SYSTEM_PROMPT;
    }

    const loadedSkillsContent = matchedSkillIds
        .map(id => SKILL_REGISTRY[id]?.instruction)
        .filter(Boolean)
        .join('\n\n');

    return `${BASE_SYSTEM_PROMPT}\n\n[Active Skills Loaded On Demand]:\n${loadedSkillsContent}`;
}
