# Technology Stack

## Language & Runtime
- **Python 3.x** - Primary language for the project
- Standard Python libraries for file operations and string formatting

## Code Quality & Formatting
- **Ruff** - Code formatter configured with single quotes
  - Configuration in `pyproject.toml`
  - Quote style: single quotes (`'`)

## Project Structure
- **pyproject.toml** - Project configuration and tool settings
- **main.py** - Script for generating tutorial markdown files

## Common Commands

### File Generation
```bash
python main.py
```
Generates all 16 tutorial markdown files in the `translate/` directory with proper naming convention (tutorial_001.md through tutorial_016.md).

### Code Formatting
```bash
ruff format .
```
Formats Python code according to project standards (single quotes).

## Development Notes
- Files are generated programmatically using Python's string formatting
- UTF-8 encoding is used for all file operations to support Japanese content
- Tutorial files follow a consistent naming pattern with zero-padded numbers