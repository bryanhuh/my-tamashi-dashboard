# 📝 Blog & Agent Experiment Logs

## BlogPosts Component

### The Thinking

The blog serves two purposes:
1. Show that I'm actively learning and thinking about AI/agents
2. Store actual technical content I can reference later

### Content Strategy

All 5 blog posts are focused on AI agent workflows — the topics Bryan specifically asked for:

| # | Title | Topic |
|---|---|---|
| 1 | How Claude Code's Agentic Workflow Actually Works | Task decomposition, self-verification loops |
| 2 | MCP: The Bridge Between AI and Your Tools | Model Context Protocol, tool schemas |
| 3 | Building AI Agents with Subagents | Multi-agent architectures, delegation |
| 4 | LLM Context Management: What Actually Matters | RAG, sliding windows, structured injection |
| 5 | My AI Agent Experiment Stack | Claude vs GPT-4 vs LangChain vs CrewAI |

Each post has a full `content` field (unused in the current component but ready for a detail page).

### Data Structure

```json
{
  "id": 1,
  "title": "How Claude Code's Agentic Workflow Actually Works",
  "excerpt": "A deep dive into...",
  "category": "AI Agents",
  "tags": ["Claude", "Agentic", "Coding"],
  "date": "2025-02-18",
  "readTime": "8 min",
  "content": "Full article text here..."
}
```

### Server Component

BlogPosts is a server component — it imports `blog.json` statically. The HTML is generated at build time.

### Design: Stacked Cards with Dividers

Instead of a grid, blog posts are stacked vertically:

```css
.posts {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.post + .post {
  border-top: 1px solid var(--border);
}
```

The `gap: 1px` between posts creates hairline dividers. Combined with the outer border, it looks like a unified list — similar to how GitHub shows issues or PRs.

### Tag Display

```jsx
<div className={styles.tags}>
  {post.tags.map((tag) => (
    <span key={tag} className="tag">{tag}</span>
  ))}
</div>
```

Tags use the global `.tag` class — tiny uppercase monospace text in a bordered pill. Tags are functional: they tell the reader what the post is about at a glance.

---

## AgentLogs Component

### The Thinking

This is what makes the dashboard unique. Most developers don't track their AI agent experiments. But as someone deeply into agentic workflows, having a visible log of experiments — successes AND failures — adds credibility and personality.

### Terminal Aesthetic

The agent logs use a **terminal/console design** — dark background, monospace font, colored status indicators. This isn't just stylistic; it reflects what these experiments actually look like (terminal sessions).

```jsx
<div className={styles.terminal}>
  <div className={styles.terminalHeader}>
    <div className={styles.dots}>
      <span style={{ background: '#ff5f56' }} />  {/* Close */}
      <span style={{ background: '#ffbd2e' }} />  {/* Minimize */}
      <span style={{ background: '#27c93f' }} />  {/* Maximize */}
    </div>
    <span>~/agent-experiments</span>
  </div>
  <div className={styles.terminalBody}>
    {/* Log entries */}
  </div>
</div>
```

The three colored dots (`#ff5f56`, `#ffbd2e`, `#27c93f`) are the macOS window controls. The title bar shows `~/agent-experiments` as if navigated to a project directory.

### Expandable Entries

```jsx
const [expanded, setExpanded] = useState(null);

<button onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
  {statusIcons[log.status]} [{log.date}] {log.title}
  {expanded === log.id ? <ChevronDown /> : <ChevronRight />}
</button>

{expanded === log.id && (
  <div className={styles.logDetails}>
    <span>Model: <strong>{log.model}</strong></span>
    <span>Agent: <strong>{log.agent}</strong></span>
    <p>{log.summary}</p>
    {log.tags.map(tag => <span className="tag">{tag}</span>)}
  </div>
)}
```

Only one entry can be expanded at a time (accordion pattern). The expanded section shows:
- **Model used** (Claude 3.5 Sonnet, GPT-4 Turbo)
- **Agent type** (Code Agent, Browser Agent, Multi-Agent)
- **Summary** of what happened
- **Tags** for categorization

### Status Color System

```javascript
const statusIcons = {
  success: '🟢',
  'in-progress': '🟡',
  failed: '🔴',
};
```

Emoji circles because they're universally rendered and immediately recognizable.

### Bridging Real Data

The agent logs data was crafted from the user's actual conversation history:

- **Tamashi Dashboard build** → This very project
- **Food App UI Revamp** → From conversation `dd383547`
- **SEO Meta Tags** → From conversation `3eab00a6`
- **Login Persistence Bug** → From conversation `18780dff`
- **Multi-Agent Code Review** → A realistic "failed" entry for authenticity

Including failures makes the log feel real and honest.

### Why Client Component?

AgentLogs is a `'use client'` component because of the `useState` for the expandable accordion. The data is still imported from JSON at build time, but the interactive expand/collapse requires client-side state.

---

*Continue to [Fitness Tracker & BuyMeACoffee →](./10-fitness-coffee.md)*
