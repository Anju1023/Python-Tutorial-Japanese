---
title: "6. モジュール"
chapter: 6
section: "実践"
prev_chapter: 5
next_chapter: 7
exam_weight: "高"
key_concepts: ["import文", "パッケージ", "__name__", "モジュール検索パス"]
estimated_time: "35分"
---

<!-- claude_translate/tutorial_006.md -->

# 6. モジュール

## モジュールが必要な理由

Pythonインタープリタを終了してまた入ると、作った定義(関数や変数)は失われちゃう。

**だから:**
- ちょっと長めのプログラムを書く場合 → テキストエディタで入力を準備して、ファイルとして実行する方がいい
- これを**スクリプト作成**という

**プログラムが長くなると:**
- メンテナンスを楽にするために、複数のファイルに分割したくなる
- 便利な関数を複数のプログラムで使いたい(でも定義を毎回コピペしたくない)

**解決策: モジュール**

Pythonには、ファイルに定義を置いて、スクリプトやインタープリタの対話インスタンスで使う方法がある。

**モジュール:**
- そういうファイルのこと
- モジュールからの定義を、他のモジュールや**メインモジュール**にインポートできる
- メインモジュール = トップレベルで実行されるスクリプトや電卓モードでアクセスできる変数の集合

## モジュールの基本

**モジュール = Python定義と文を含むファイル**

**ファイル名:**
- モジュール名に接尾辞 `.py` を付けたもの

**モジュール内:**
- モジュールの名前(文字列として)は、グローバル変数 `__name__` の値として利用可能

### モジュールの例

お気に入りのテキストエディタで、現在のディレクトリに `fibo.py` というファイルを作成:

```python
# フィボナッチ数列モジュール

def fib(n):    # nまでのフィボナッチ数列を書く
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()

def fib2(n):   # nまでのフィボナッチ数列を返す
    result = []
    a, b = 0, 1
    while a < n:
        result.append(a)
        a, b = b, a+b
    return result
```

### モジュールのインポート

Pythonインタープリタに入って、このモジュールをインポート:

```python
>>> import fibo
```

**これは何をする?**
- `fibo` で定義された関数の名前を、現在のシンボルテーブルに直接入れない
- モジュール名 `fibo` だけをそこに入れる

**モジュール名を使って関数にアクセス:**

```python
>>> fibo.fib(1000)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
>>> fibo.fib2(100)
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
>>> fibo.__name__
'fibo'
```

**関数をよく使う場合、ローカル名に割り当てられる:**

```python
>>> fib = fibo.fib
>>> fib(500)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377
```

## 6.1. モジュールについてもっと

### モジュールの実行文

**モジュールには:**
- 関数定義だけじゃなく
- 実行文も含められる

**これらの文の目的:**
- モジュールを初期化する
- インポート文でモジュール名が最初に見つかった時に**1回だけ**実行される
- (ファイルがスクリプトとして実行される場合も実行される)

### プライベートシンボルテーブル

**各モジュールには独自のプライベートシンボルテーブルがある:**
- モジュール内で定義されたすべての関数のグローバルシンボルテーブルとして使われる

**メリット:**
- モジュールの作者は、ユーザーのグローバル変数との衝突を心配せずに、モジュール内でグローバル変数を使える

**逆に:**
- 何をしてるか分かってる場合
- 関数を参照するのと同じ記法 `modname.itemname` でモジュールのグローバル変数にアクセスできる

### モジュールのインポート

**モジュールは他のモジュールをインポートできる:**
- 慣習的(でも必須じゃない)に、すべての `import` 文をモジュール(またはスクリプト)の最初に配置
- インポートされたモジュール名は、インポートするモジュールのグローバルシンボルテーブルに配置される

### importの変形

**`from` を使った変形:**
モジュールから名前を直接インポートするモジュールのシンボルテーブルにインポート:

```python
>>> from fibo import fib, fib2
>>> fib(500)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377
```

**これは:**
- インポート元のモジュール名をローカルシンボルテーブルに導入しない
- (この例では `fibo` は定義されない)

**すべての名前をインポートする変形:**

```python
>>> from fibo import *
>>> fib(500)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377
```

**これは:**
- アンダースコア(`_`)で始まるもの以外のすべての名前をインポート

**注意:**
- ほとんどの場合、Pythonプログラマーはこの機能を使わない
- 未知の名前セットをインタープリタに導入して、既に定義したものを隠す可能性があるから
- 一般的に、モジュールやパッケージから `*` をインポートするのは好ましくない
  - コードが読みにくくなることが多いから
- でも、対話セッションでタイピングを節約するために使うのはOK

### asでエイリアス

**モジュール名の後に `as` を付ける:**

```python
>>> import fibo as fib
>>> fib.fib(500)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377
```

**これは:**
- `import fibo` と同じ方法でモジュールをインポート
- 唯一の違いは `fib` として利用可能になること

**`from` と組み合わせても使える:**

```python
>>> from fibo import fib as fibonacci
>>> fibonacci(500)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377
```

### 効率性の注意

**重要:**
- 効率性の理由から、各モジュールはインタープリタセッションごとに1回だけインポートされる
- だから、モジュールを変更したら、インタープリタを再起動する必要がある
- または、1つのモジュールだけを対話的にテストしたい場合:
  - `importlib.reload()` を使う
  - 例: `import importlib; importlib.reload(modulename)`

## 6.1.1. モジュールをスクリプトとして実行

**Pythonモジュールを以下のように実行:**

```bash
python fibo.py <arguments>
```

**モジュール内のコードが実行される:**
- インポートした時と同じように
- でも `__name__` が `"__main__"` に設定される

**つまり、モジュールの最後にこのコードを追加すると:**

```python
if __name__ == "__main__":
    import sys
    fib(int(sys.argv[1]))
```

**ファイルを:**
- スクリプトとしても
- インポート可能なモジュールとしても

使えるようになる!

**なぜなら:**
- コマンドラインを解析するコードは、モジュールが「メイン」ファイルとして実行された時だけ実行されるから

**実行例:**

```bash
$ python fibo.py 50
0 1 1 2 3 5 8 13 21 34
```

**モジュールがインポートされる場合、コードは実行されない:**

```python
>>> import fibo
>>>
```

**これはよく使われる:**
- モジュールに便利なユーザーインターフェースを提供するため
- テスト目的(モジュールをスクリプトとして実行すると、テストスイートを実行)

## 6.1.2. モジュール検索パス

**`spam` という名前のモジュールがインポートされる時:**

1. インタープリタはまず、その名前の組み込みモジュールを探す
   - これらのモジュール名は `sys.builtin_module_names` にリストされてる
2. 見つからない場合、変数 `sys.path` で指定されたディレクトリのリストから `spam.py` という名前のファイルを探す

### sys.pathの初期化場所

**`sys.path` は以下の場所から初期化される:**

1. **入力スクリプトを含むディレクトリ**(ファイルが指定されてない場合は現在のディレクトリ)
2. **`PYTHONPATH`**(ディレクトリ名のリスト、シェル変数 `PATH` と同じ構文)
3. **インストール依存のデフォルト**(慣例的に `site-packages` ディレクトリを含む、`site` モジュールで処理)

**シンボリックリンクをサポートするファイルシステムでの注意:**
- 入力スクリプトを含むディレクトリは、シンボリックリンクをたどった後に計算される
- つまり、シンボリックリンクを含むディレクトリはモジュール検索パスに追加されない

### sys.pathの変更

**初期化後:**
- Pythonプログラムは `sys.path` を変更できる
- 実行中のスクリプトを含むディレクトリが、検索パスの最初に配置される
  - 標準ライブラリパスより前
- つまり、そのディレクトリのスクリプトが、ライブラリディレクトリの同名モジュールの代わりにロードされる
- 置き換えが意図されてない限り、これはエラー

詳しくは「標準モジュール」セクションを見てね。

## 6.1.3. 「コンパイル済み」Pythonファイル

**モジュールのロードを高速化するため:**
- Pythonは各モジュールのコンパイル済みバージョンを `__pycache__` ディレクトリに `module.version.pyc` という名前でキャッシュ
- version はコンパイル済みファイルのフォーマットをエンコード
- 通常Pythonバージョン番号を含む
- 例: CPython リリース3.3では、`spam.py` のコンパイル済みバージョンは `__pycache__/spam.cpython-33.pyc` としてキャッシュされる

**この命名規則:**
- 異なるリリースや異なるバージョンのPythonからのコンパイル済みモジュールが共存できるようにする

**Pythonの動作:**
- ソースの更新日時をコンパイル済みバージョンと照合して、期限切れで再コンパイルが必要かチェック
- 完全に自動的なプロセス
- コンパイル済みモジュールはプラットフォーム非依存
  - 同じライブラリを異なるアーキテクチャのシステム間で共有できる

### Pythonがキャッシュをチェックしない2つの状況

1. **コマンドラインから直接ロードされるモジュール:**
   - 常に再コンパイルして、結果を保存しない

2. **ソースモジュールがない場合:**
   - キャッシュをチェックしない
   - ソースなし(コンパイル済みのみ)配布をサポートするには:
     - コンパイル済みモジュールはソースディレクトリになければならない
     - ソースモジュールがあってはいけない

### エキスパート向けのヒント

**`-O` または `-OO` スイッチ:**
- Pythonコマンドでコンパイル済みモジュールのサイズを削減
- `-O` スイッチ: assert文を削除
- `-OO` スイッチ: assert文と `__doc__` 文字列の両方を削除
- これらが利用可能であることに依存するプログラムもあるから、何をしてるか分かってる場合のみ使おう
- 「最適化された」モジュールには `opt-` タグがあり、通常小さい
- 将来のリリースで最適化の効果が変わる可能性あり

**実行速度:**
- `.pyc` ファイルから読み込んでも、`.py` ファイルから読み込んでも、プログラムの実行速度は変わらない
- `.pyc` ファイルで速いのはロード速度だけ

**`compileall` モジュール:**
- ディレクトリ内のすべてのモジュールの .pyc ファイルを作成できる

このプロセスの詳細(決定のフローチャートを含む)は、PEP 3147にあるよ。

## 6.2. 標準モジュール

**Pythonには標準モジュールのライブラリが付属:**
- 別のドキュメント「Python Library Reference」に記載

**一部のモジュールはインタープリタに組み込まれてる:**
- 言語のコアの一部じゃない操作へのアクセスを提供
- 効率性のため、またはシステムコールのようなOSプリミティブへのアクセスを提供するため
- そのようなモジュールのセットは設定オプションで、基盤となるプラットフォームにも依存
- 例: `winreg` モジュールはWindowsシステムでのみ提供

### sys モジュール

**特に注目すべきモジュール: `sys`**
- すべてのPythonインタープリタに組み込まれてる

**変数 `sys.ps1` と `sys.ps2`:**
- プライマリとセカンダリのプロンプトとして使われる文字列を定義

```python
>>> import sys
>>> sys.ps1
'>>> '
>>> sys.ps2
'... '
>>> sys.ps1 = 'C> '
C> print('Yuck!')
Yuck!
C>
```

**これらの2つの変数:**
- インタープリタが対話モードの場合のみ定義される

**変数 `sys.path`:**
- インタープリタのモジュール検索パスを決定する文字列のリスト
- 環境変数 `PYTHONPATH` から取られたデフォルトパスに初期化される
- `PYTHONPATH` が設定されてない場合は組み込みデフォルトから
- 標準的なリスト操作で変更できる:

```python
>>> import sys
>>> sys.path.append('/ufs/guido/lib/python')
```

## 6.3. dir()関数

**組み込み関数 `dir()`:**
- モジュールが定義する名前を調べるために使う
- ソート済みの文字列リストを返す

```python
>>> import fibo, sys
>>> dir(fibo)
['__name__', 'fib', 'fib2']
>>> dir(sys)  
['__breakpointhook__', '__displayhook__', '__doc__', '__excepthook__',
 '__interactivehook__', '__loader__', '__name__', '__package__', '__spec__',
 '__stderr__', '__stdin__', '__stdout__', '__unraisablehook__',
 '_clear_type_cache', '_current_frames', '_debugmallocstats', '_framework',
 '_getframe', '_git', '_home', '_xoptions', 'abiflags', 'addaudithook',
 'api_version', 'argv', 'audit', 'base_exec_prefix', 'base_prefix',
 'breakpointhook', 'builtin_module_names', 'byteorder', 'call_tracing',
 'callstats', 'copyright', 'displayhook', 'dont_write_bytecode', 'exc_info',
 'excepthook', 'exec_prefix', 'executable', 'exit', 'flags', 'float_info',
 'float_repr_style', 'get_asyncgen_hooks', 'get_coroutine_origin_tracking_depth',
 'getallocatedblocks', 'getdefaultencoding', 'getdlopenflags',
 'getfilesystemencodeerrors', 'getfilesystemencoding', 'getprofile',
 'getrecursionlimit', 'getrefcount', 'getsizeof', 'getswitchinterval',
 'gettrace', 'hash_info', 'hexversion', 'implementation', 'int_info',
 'intern', 'is_finalizing', 'last_traceback', 'last_type', 'last_value',
 'maxsize', 'maxunicode', 'meta_path', 'modules', 'path', 'path_hooks',
 'path_importer_cache', 'platform', 'prefix', 'ps1', 'ps2', 'pycache_prefix',
 'set_asyncgen_hooks', 'set_coroutine_origin_tracking_depth', 'setdlopenflags',
 'setprofile', 'setrecursionlimit', 'setswitchinterval', 'settrace', 'stderr',
 'stdin', 'stdout', 'thread_info', 'unraisablehook', 'version', 'version_info',
 'warnoptions']
```

**引数なしの `dir()`:**
- 現在定義してる名前をリスト:

```python
>>> a = [1, 2, 3, 4, 5]
>>> import fibo
>>> fib = fibo.fib
>>> dir()
['__builtins__', '__name__', 'a', 'fib', 'fibo', 'sys']
```

**注意:** すべてのタイプの名前をリスト(変数、モジュール、関数など)

**`dir()` は組み込み関数と変数の名前をリストしない:**
- それらのリストが欲しい場合、標準モジュール `builtins` で定義されてる:

```python
>>> import builtins
>>> dir(builtins)  
['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException',
 'BlockingIOError', 'BrokenPipeError', 'BufferError', 'BytesWarning',
 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionError',
 'ConnectionRefusedError', 'ConnectionResetError', 'DeprecationWarning',
 'EOFError', 'Ellipsis', 'EnvironmentError', 'Exception', 'False',
 'FileExistsError', 'FileNotFoundError', 'FloatingPointError',
 'FutureWarning', 'GeneratorExit', 'IOError', 'ImportError',
 'ImportWarning', 'IndentationError', 'IndexError', 'InterruptedError',
 'IsADirectoryError', 'KeyError', 'KeyboardInterrupt', 'LookupError',
 'MemoryError', 'NameError', 'None', 'NotADirectoryError', 'NotImplemented',
 'NotImplementedError', 'OSError', 'OverflowError',
 'PendingDeprecationWarning', 'PermissionError', 'ProcessLookupError',
 'ReferenceError', 'ResourceWarning', 'RuntimeError', 'RuntimeWarning',
 'StopIteration', 'SyntaxError', 'SyntaxWarning', 'SystemError',
 'SystemExit', 'TabError', 'TimeoutError', 'True', 'TypeError',
 'UnboundLocalError', 'UnicodeDecodeError', 'UnicodeEncodeError',
 'UnicodeError', 'UnicodeTranslateError', 'UnicodeWarning', 'UserWarning',
 'ValueError', 'Warning', 'ZeroDivisionError', '_', '__build_class__',
 '__debug__', '__doc__', '__import__', '__name__', '__package__', 'abs',
 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
 'chr', 'classmethod', 'compile', 'complex', 'copyright', 'credits',
 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'exit',
 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr',
 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass',
 'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview',
 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property',
 'quit', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars',
 'zip']
```

## 6.4. パッケージ

**パッケージ = 「ドット付きモジュール名」を使ってPythonのモジュール名前空間を構造化する方法**

**例:**
- モジュール名 `A.B` は、パッケージ `A` 内のサブモジュール `B` を指定

**メリット:**
- モジュールの使用が、異なるモジュールの作者がお互いのグローバル変数名を心配しなくて済むのと同じように
- ドット付きモジュール名の使用で、NumPyやPillowのようなマルチモジュールパッケージの作者が、お互いのモジュール名を心配しなくて済む

### パッケージの例: サウンド処理

**サウンドファイルとサウンドデータを統一的に扱うモジュールのコレクション(「パッケージ」)を設計したいとする:**

**多くの異なるサウンドファイル形式がある:**
- 通常拡張子で認識される(例: `.wav`, `.aiff`, `.au`)
- 様々なファイル形式間の変換のための、成長し続けるモジュールのコレクションを作成・維持する必要があるかも

**サウンドデータで実行したい多くの異なる操作もある:**
- ミキシング、エコーの追加、イコライザー機能の適用、人工ステレオ効果の作成など
- これらの操作を実行するための終わりのないモジュールのストリームを書くことになる

### パッケージの構造例

**階層的なファイルシステムで表現されたパッケージの可能な構造:**

```
sound/                          トップレベルパッケージ
      __init__.py               soundパッケージを初期化
      formats/                  ファイル形式変換のサブパッケージ
              __init__.py
              wavread.py
              wavwrite.py
              aiffread.py
              aiffwrite.py
              auread.py
              auwrite.py
              ...
      effects/                  サウンド効果のサブパッケージ
              __init__.py
              echo.py
              surround.py
              reverse.py
              ...
      filters/                  フィルタのサブパッケージ
              __init__.py
              equalizer.py
              vocoder.py
              karaoke.py
              ...
```

### __init__.pyファイル

**パッケージをインポートする時:**
- Pythonは `sys.path` 上のディレクトリを通してパッケージサブディレクトリを探す

**`__init__.py` ファイルが必要:**
- Pythonがそのファイルを含むディレクトリをパッケージとして扱うために必要
- `string` のような一般的な名前のディレクトリが、モジュール検索パスで後に出てくる有効なモジュールを意図せず隠すのを防ぐ

**最もシンプルなケース:**
- `__init__.py` は空ファイルでOK
- でも、パッケージの初期化コードを実行したり
- `__all__` 変数を設定したりもできる(後で説明)

### パッケージからのインポート

**パッケージのユーザーは、パッケージから個別のモジュールをインポートできる:**

**例1:**
```python
import sound.effects.echo
```

これはサブモジュール `sound.effects.echo` をロード。フルネームで参照する必要がある:

```python
sound.effects.echo.echofilter(input, output, delay=0.7, atten=4)
```

**例2:**
```python
from sound.effects import echo
```

これもサブモジュール `echo` をロードして、パッケージプレフィックスなしで使える:

```python
echo.echofilter(input, output, delay=0.7, atten=4)
```

**例3:**
```python
from sound.effects.echo import echofilter
```

これもサブモジュール `echo` をロードするけど、関数 `echofilter()` を直接使える:

```python
echofilter(input, output, delay=0.7, atten=4)
```

### importの動作

**`from package import item` を使う時:**
- item は、パッケージのサブモジュール(またはサブパッケージ)でもいいし
- パッケージで定義された他の名前(関数、クラス、変数など)でもいい

**`import` 文の動作:**
1. まず、item がパッケージで定義されてるかテスト
2. そうでない場合、モジュールだと仮定してロードを試みる
3. 見つからない場合、`ImportError` 例外を発生

**逆に、`import item.subitem.subsubitem` のような構文を使う時:**
- 最後を除く各 item はパッケージでなければならない
- 最後の item はモジュールまたはパッケージでOK
- でも、前の item で定義されたクラス、関数、変数であってはダメ

## 6.4.1. パッケージから * をインポート

**ユーザーが `from sound.effects import *` と書いた場合、何が起こる?**

**理想的には:**
- ファイルシステムに行って、パッケージにどのサブモジュールがあるか見つけて、すべてインポートする?
- でも、時間がかかる可能性あり
- サブモジュールのインポートで望ましくない副作用が起こるかも(サブモジュールが明示的にインポートされた時だけ起こるべき)

**唯一の解決策:**
- パッケージ作者がパッケージの明示的なインデックスを提供

**`import` 文の規約:**
- パッケージの `__init__.py` コードが `__all__` という名前のリストを定義してる場合
- それは `from package import *` が出会った時にインポートすべきモジュール名のリストとみなされる

**パッケージ作者の責任:**
- パッケージの新しいバージョンがリリースされた時、このリストを最新に保つ
- パッケージから `*` をインポートする用途が見当たらない場合、サポートしないことも決められる

**例: `sound/effects/__init__.py`**

```python
__all__ = ["echo", "surround", "reverse"]
```

これは `from sound.effects import *` が、`sound.effects` パッケージの3つの名前付きサブモジュールをインポートすることを意味する。

### __all__が定義されてない場合

**`__all__` が定義されてない場合:**
- `from sound.effects import *` は、パッケージ `sound.effects` からすべてのサブモジュールを現在の名前空間にインポート**しない**
- 単にパッケージ `sound.effects` がインポートされたことを保証するだけ
  - (場合によっては `__init__.py` の初期化コードを実行)
- その後、パッケージで定義された名前をインポート

**これに含まれるもの:**
- `__init__.py` で定義された(および明示的にロードされたサブモジュール)任意の名前
- 前の `import` 文で明示的にロードされたパッケージのサブモジュール

**例:**

```python
import sound.effects.echo
import sound.effects.surround
from sound.effects import *
```

この例では:
- `echo` と `surround` モジュールが現在の名前空間にインポートされる
- `from...import` 文が実行された時、`sound.effects` パッケージで定義されてるから
- (`__all__` が定義されてる場合もこれは動く)

**注意:**
- 特定のモジュールは、`import *` を使う時に特定のパターンに従う名前のみをエクスポートするように設計されてる
- でも、本番コードではまだ悪い習慣と考えられてる

**覚えておいて:**
- `from package import specific_submodule` を使うことに何も問題はない!
- 実際、インポートするモジュールが異なるパッケージから同じ名前のサブモジュールを使う必要がない限り、これが推奨される記法

## 6.4.2. パッケージ内参照

**パッケージがサブパッケージに構造化されてる場合:**
- (例の `sound` パッケージのように)
- 兄弟パッケージのサブモジュールを参照するのに絶対インポートを使える

**例:**
- モジュール `sound.filters.vocoder` が `sound.effects` パッケージの `echo` モジュールを使う必要がある場合
- `from sound.effects import echo` を使える

### 相対インポート

**相対インポートも書ける:**
- `from module import name` 形式のインポート文で

**これらのインポートは先頭のドットを使う:**
- 相対インポートに関与する現在のパッケージと親パッケージを示す

**`surround` モジュールからの例:**

```python
from . import echo
from .. import formats
from ..filters import equalizer
```

**注意:**
- 相対インポートは現在のモジュールの名前に基づく
- メインモジュールの名前は常に `"__main__"` だから
- Pythonアプリケーションのメインモジュールとして使うことを意図したモジュールは、常に絶対インポートを使わなければならない

## 6.4.3. 複数ディレクトリのパッケージ

**パッケージはもう1つ特別な属性 `__path__` をサポート:**

**初期化:**
- パッケージの `__init__.py` を保持するディレクトリの名前を含むリストに初期化される
- そのファイルのコードが実行される前

**この変数は変更できる:**
- 変更すると、パッケージに含まれるモジュールとサブパッケージの今後の検索に影響

**用途:**
- この機能はあまり必要とされないけど
- パッケージで見つかるモジュールのセットを拡張するのに使える

---

## この章の重要ポイントまとめ( ˶'ᵕ'˶)

### モジュールの基本
- モジュール = `.py` ファイル
- `import module` でインポート
- `from module import name` で特定の名前をインポート
- `import module as alias` でエイリアス

### モジュールの仕組み
- モジュールは1回だけインポートされる(効率性のため)
- `__name__ == "__main__"` でスクリプトとしても使える
- `sys.path` でモジュール検索パス
- `__pycache__` にコンパイル済みファイル

### 便利な関数
- `dir()`: モジュールの名前をリスト
- `dir(builtins)`: 組み込み名前をリスト

### パッケージ
- パッケージ = モジュールの階層構造
- `__init__.py` が必要(ディレクトリをパッケージとして認識)
- `from package import *` は `__all__` で制御
- 絶対インポート vs 相対インポート(`.` や `..` を使う)

### ベストプラクティス
- `from module import *` は避ける(対話セッション以外)
- `from package import specific_module` を使う
- 相対インポートはメインモジュールでは使わない

---

## 📝 この章の重要ポイント

### 🎯 試験頻出ポイント
- **モジュールの基本**: `.py`ファイル、`import`文、`__name__`変数
- **インポート方法**: `import module`、`from module import name`、`import module as alias`
- **モジュール検索パス**: `sys.path`、PYTHONPATH環境変数
- **パッケージ**: `__init__.py`、ドット記法でのアクセス
- **`if __name__ == "__main__"`**: スクリプトとして実行された時のみ実行

### 💡 覚えておくべきキーワード
- **`__name__`**: モジュール名を格納する特殊変数
- **`dir()`**: モジュールの名前一覧を取得
- **`__all__`**: `from module import *`で公開する名前のリスト
- **相対インポート**: `from . import module`（パッケージ内でのみ使用）
- **標準ライブラリ**: Pythonに同梱されているモジュール群

### ⚡ よくある間違い
- **`from module import *`の乱用**: 名前空間の汚染を引き起こす
- **循環インポート**: モジュール同士が相互にインポートする問題
- **相対インポートをメインモジュールで使用**: エラーになる
- **パッケージに`__init__.py`がない**: Python 3.3以降は不要だが推奨

---

**次の章**: [7. 入出力](tutorial_007.md)