flowchart TD
    Start[Start] --> SignIn[Sign In Page]
    Start --> SignUp[Sign Up Page]
    SignIn --> AuthAPI[Auth API Route]
    SignUp --> AuthAPI
    AuthAPI --> AuthCheck{Auth Success}
    AuthCheck -->|Yes| Dashboard[Dashboard Page]
    AuthCheck -->|No| SignIn
    Dashboard --> FetchData[Fetch Usage Data]
    FetchData --> DB[Drizzle ORM PostgreSQL]
    DB --> FetchData
    FetchData --> Render[Render Dashboard Components]
    Render --> Cards[Section Cards]
    Render --> Table[Data Table]
    Render --> Chart[Interactive Chart]
    Render --> End[End]