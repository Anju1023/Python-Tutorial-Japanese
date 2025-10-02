for i in range(1, 17):
    filepath = f'claude_translate/tutorial_{i:03}.md'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f'<!-- {filepath} -->\n\n')
        print(f'{filepath}作成完了！')
