# Project Structure

## Root Directory
```
├── main.py              # Tutorial file generator script
├── pyproject.toml       # Project configuration and tool settings
└── translate/           # Tutorial content directory
    ├── tutorial_001.md  # Tutorial 1: Introduction to Python
    ├── tutorial_002.md  # Tutorial 2: [Content varies]
    ├── ...
    └── tutorial_016.md  # Tutorial 16: [Final tutorial]
```

## Directory Organization

### `/translate/`
Contains all tutorial markdown files in Japanese. Files follow a strict naming convention:
- Pattern: `tutorial_XXX.md` where XXX is zero-padded number (001-016)
- Each file contains a single tutorial chapter
- Files include HTML comment headers with their filepath
- Content is educational Python programming material in Japanese

### Root Files
- **main.py**: Simple script that generates the tutorial file structure
- **pyproject.toml**: Minimal configuration focusing on code formatting rules

## File Naming Conventions
- Tutorial files: `tutorial_XXX.md` (zero-padded 3-digit numbers)
- Python files: Standard snake_case naming
- Configuration files: Standard naming (pyproject.toml)

## Content Structure
- Each tutorial file starts with an HTML comment containing its filepath
- Japanese content follows with proper markdown formatting
- Tutorials are numbered sequentially from 001 to 016
- Content covers Python fundamentals to advanced topics

## Development Workflow
1. Modify `main.py` if tutorial structure needs changes
2. Run `python main.py` to regenerate tutorial files
3. Edit individual tutorial content in `/translate/` directory
4. Use `ruff format .` to maintain code style consistency