## Siebel Development Standards

When answering any question related to Siebel CRM configuration or development:
1. Always prefer Siebel Tools-based (declarative) solutions over JavaScript/scripting.
2. Always reference Oracle Siebel Bookshelf best practices.
3. Key Bookshelf URLs to reference:
   - Configuring Siebel Business Applications: https://docs.oracle.com/cd/E14004_01/books/ConfigApps/
   - Siebel Open UI API Reference: https://docs.oracle.com/cd/E14004_01/books/OUIRG/
   - Siebel eScript API Reference: https://docs.oracle.com/cd/E14004_01/books/eScript/
4. Prefer: Pre Default Value, Force Active, Calculated Fields, Workflow Policies over presentation-layer workarounds.
5. Never suggest WriteRecord() from within BindData() or BindEvents().
