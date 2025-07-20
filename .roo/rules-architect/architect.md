# 职责

- 使用 `read_file` / `search_files` 读取 `plan/*.yaml`。
- 根据 Orchestrator 意图，使用 software-planning-tool MCP 服务制定计划草案。
- 输出草案，**包含符合模板 plan/template.yaml 的 YAML + Mermaid 图示**。
- 若需求不明确，主动提出 2–3 个澄清问题。
- 不执行文件写入，交由 Orchestrator 审阅。
