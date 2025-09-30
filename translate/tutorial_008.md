<!-- translate/tutorial_008.md -->

## 8. エラーと例外

これまではエラーメッセージについて軽く触れる程度でしたが、もしあなたが例を試してきたなら、おそらくいくつか見てきたことでしょう。エラーには（少なくとも）2つの区別できる種類があります。**構文エラー (syntax errors)** と **例外 (exceptions)** です。

### 8.1. 構文エラー

構文エラーは、**解析エラー (parsing errors)** とも呼ばれ、Pythonをまだ学んでいるうちにおそらく最もよく目にする不満の種類です。

```python
>>> while True print('Hello world')
  File "<stdin>", line 1
    while True print('Hello world')
                   ^
SyntaxError: invalid syntax
```

パーサー（構文解析器）は、問題の行を繰り返し表示し、エラーが検出された行の最も早い箇所を指す小さな「矢印」を表示します。エラーは、矢印の前のトークン（単語や記号）によって引き起こされます（あるいは、少なくともそこで検出されます）。この例では、エラーは関数 `print()` で検出されています。なぜなら、その前にコロン (`:`) が抜けているからです。入力がスクリプトから来た場合にどこを見ればよいか分かるように、ファイル名と行番号も表示されます。

### 8.2. 例外

文や式が構文的に正しくても、それを実行しようとするとエラーを引き起こすことがあります。実行中に検出されるエラーは**例外**と呼ばれ、必ずしも致命的ではありません。Pythonプログラムでそれらをどのように処理するかはすぐに学びます。しかし、ほとんどの例外はプログラムによって処理されず、ここに示されるようなエラーメッセージになります。

```python
>>> 10 * (1/0)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ZeroDivisionError: division by zero
>>> 4 + spam*3
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'spam' is not defined
>>> '2' + 2
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: can only concatenate str (not "int") to str
```

エラーメッセージの最後の行は、何が起こったかを示しています。例外にはさまざまな種類があり、その種類がメッセージの一部として表示されます。この例での種類は `ZeroDivisionError`、`NameError`、`TypeError` です。例外の種類として表示される文字列は、発生した組み込み例外の名前です。これはすべての組み込み例外に当てはまりますが、ユーザー定義の例外には必ずしも当てはまりません（ただし、そうするのが便利な慣習です）。標準的な例外名は、組み込みの識別子です（予約されたキーワードではありません）。

行の残りの部分は、例外の種類とそれが引き起こされた原因に基づいた詳細を提供します。

エラーメッセージの前の部分は、スタックのトレースバックの形で、例外が発生したコンテキストを示します。一般的に、ソースコードの行をリストアップするスタックトレースバックが含まれますが、標準入力から読み取られた行は表示されません。

「組み込み例外」の章では、組み込み例外とその意味がリストされています。

### 8.3. 例外を処理する

特定の例外を処理するプログラムを書くことが可能です。次の例を見てください。これは、有効な整数が入力されるまでユーザーに入力を求め続けますが、ユーザーがプログラムを中断すること（Control-Cやオペレーティングシステムがサポートする他の方法を使用）を許可します。ユーザーによる中断は `KeyboardInterrupt` 例外を送出することで通知されることに注意してください。

```python
>>> while True:
...     try:
...         x = int(input("Please enter a number: "))
...         break
...     except ValueError:
...         print("おっと！ それは有効な数字ではありませんでした。もう一度試してください...")
...
```

`try` 文は次のように動作します。

1.  まず、**`try` 節**（`try` と `except` キーワードの間の文）が実行されます。
2.  例外が発生しなければ、`except` 節はスキップされ、`try` 文の実行は終了します。
3.  `try` 節の実行中に例外が発生すると、その節の残りの部分はスキップされます。その後、その例外の型が `except` キーワードの後に指定された例外と一致する場合、`except` 節が実行され、その後 `try` 文の後の処理が続行されます。
4.  `except` 節で指定された例外と一致しない例外が発生した場合、それは外側の `try` 文に渡されます。もしハンドラが見つからなければ、それは**未処理の例外 (unhandled exception)** となり、上記で示したようなメッセージと共に実行が停止します。

`try` 文は、異なる例外に対するハンドラを指定するために、複数の `except` 節を持つことができます。最大でも1つのハンドラしか実行されません。ハンドラは、対応する `try` 節で発生した例外のみを処理し、同じ `try` 文の他のハンドラで発生したものは処理しません。`except` 節は、丸括弧で囲んだタプルとして複数の例外を指定することができます。例えば、

```python
... except (RuntimeError, TypeError, NameError):
...     pass
```
`except` 節内のクラスは、それが同じクラスであるか、その基底クラスである場合に、例外と互換性があります（逆は成り立ちません — 派生クラスをリストする `except` 節は、基底クラスと互換性がありません）。例えば、次のコードは B, C, D をその順で表示します。

```python
class B(Exception):
    pass

class C(B):
    pass

class D(C):
    pass

for cls in [B, C, D]:
    try:
        raise cls()
    except D:
        print("D")
    except C:
        print("C")
    except B:
        print("B")
```

もし `except` 節の順序が逆だったら（最初に `except B` があったら）、B, B, B と表示されたでしょう — 最初に一致した `except` 節がトリガーされます。

最後の `except` 節は、ワイルドカードとして機能させるために、例外名を省略することができます。これは、実際のプログラミングエラーを簡単に隠してしまう可能性があるため、細心の注意を払って使用してください！エラーメッセージを表示してから例外を再送出する（呼び出し元も例外を処理できるようにする）ためにも使えます。

```python
import sys

try:
    f = open('myfile.txt')
    s = f.readline()
    i = int(s.strip())
except OSError as err:
    print("OS error: {0}".format(err))
except ValueError:
    print("データを整数に変換できませんでした。")
except:
    print("予期せぬエラー:", sys.exc_info())
    raise
```

`try ... except` 文には、オプションで `else` 節を付けることができます。これは、存在する場合、すべての `except` 節の後に続かなければなりません。これは、`try` 節が例外を送出しなかった場合に実行しなければならないコードに便利です。例えば、

```python
for arg in sys.argv[1:]:
    try:
        f = open(arg, 'r')
    except OSError:
        print('cannot open', arg)
    else:
        print(arg, 'has', len(f.readlines()), 'lines')
        f.close()
```
`else` 節の使用は、`try` 節に追加のコードを加えるよりも優れています。なぜなら、`try ... except` 文によって保護されているコードから送出されたわけではない例外を、誤ってキャッチしてしまうのを避けるからです。

例外が発生すると、それは関連する値、**例外の引数**としても知られるものを持つことがあります。引数の有無と型は、例外の種類に依存します。

`except` 節では、例外名の後に変数を指定できます。その変数は、`instance.args` に引数が格納された例外インスタンスに束縛されます。便宜上、例外インスタンスは `__str__()` を定義しているので、`.args` を参照しなくても引数を直接表示できます。例外を送出する前にインスタンス化し、好きな属性を追加することも可能です。

```python
>>> try:
...     raise Exception('spam', 'eggs')
... except Exception as inst:
...     print(type(inst))    # a exception instance
...     print(inst.args)     # arguments stored in .args
...     print(inst)          # __str__ allows args to be printed directly,
...                          # but may be overridden in exception subclasses
...     x, y = inst.args     # unpack args
...     print('x =', x)
...     print('y =', y)
...
<class 'Exception'>
('spam', 'eggs')
('spam', 'eggs')
x = spam
y = eggs
```
例外に引数がある場合、それらは未処理の例外のメッセージの最後の部分（「詳細」）として表示されます。

例外ハンドラは、`try` 節で直接発生した場合だけでなく、`try` 節内で（間接的にでも）呼び出された関数の内部で発生した場合にも例外を処理します。例えば、

```python
>>> def this_fails():
...     x = 1/0
...
>>> try:
...     this_fails()
... except ZeroDivisionError as err:
...     print('Handling run-time error:', err)
...
Handling run-time error: division by zero
```

### 8.4. 例外を送出する

`raise` 文を使うと、プログラマは指定した例外を強制的に発生させることができます。例えば、

```python
>>> raise NameError('HiThere')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: HiThere
```
`raise` への唯一の引数は、送出する例外を示します。これは、例外インスタンスか例外クラス（`Exception` から派生したクラス）でなければなりません。例外クラスが渡された場合、引数なしでそのコンストラクタを呼び出すことによって、暗黙的にインスタンス化されます。

```python
raise ValueError  # 'raise ValueError()' の短縮形
```
例外が発生したかどうかを判断する必要があるが、それを処理するつもりはない場合、より単純な形式の `raise` 文で例外を再送出することができます。

```python
>>> try:
...     raise NameError('HiThere')
... except NameError:
...     print('An exception flew by!')
...     raise
...
An exception flew by!
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
NameError: HiThere
```

### 8.5. 例外の連鎖 (Exception Chaining)

`raise` 文には、オプションで `from` を付けることができ、これにより例外を連鎖させることができます。例えば、

```python
# exc は例外インスタンスか None でなければならない
raise RuntimeError from exc
```

これは、例外を変換するときに便利です。例えば、

```python
>>> def func():
...     raise IOError
...
>>> try:
...     func()
... except IOError as exc:
...     raise RuntimeError('Failed to open database') from exc
...
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
  File "<stdin>", line 2, in func
OSError

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError: Failed to open database
```
例外の連鎖は、例外が `except` または `finally` セクション内で送出されたときに自動的に起こります。例外の連鎖は `from None` というイディオムを使うことで無効にできます。

```python
>>> try:
...     open('database.sqlite')
... except OSError:
...     raise RuntimeError from None
...
Traceback (most recent call last):
  File "<stdin>", line 4, in <module>
RuntimeError
```
連鎖の仕組みに関する詳細は、「組み込み例外」を参照してください。

### 8.6. ユーザー定義の例外

プログラムは、新しい例外クラスを作成することで、独自の例外に名前を付けることができます（Pythonクラスについての詳細は「クラス」を参照）。例外は通常、直接または間接的に `Exception` クラスから派生させるべきです。

例外クラスは、他のクラスができることなら何でもできるように定義できますが、通常はシンプルに保たれ、多くの場合、エラーに関する情報を例外ハンドラが抽出できるようにするいくつかの属性を提供するだけです。

ほとんどの例外は、標準例外の命名と同様に、名前が「Error」で終わるように定義されます。

多くの標準モジュールは、それらが定義する関数で発生する可能性のあるエラーを報告するために、独自の例外を定義しています。クラスに関する詳細は「クラス」の章で紹介します。

### 8.7. クリーンアップアクションを定義する

`try` 文には、もう一つオプションの節があり、これはどんな状況下でも実行されなければならないクリーンアップアクションを定義するためのものです。例えば、

```python
>>> try:
...     raise KeyboardInterrupt
... finally:
...     print('Goodbye, world!')
...
Goodbye, world!
Traceback (most recent call last):
  File "<stdin>", line 2, in <module>
KeyboardInterrupt
```
`finally` 節が存在する場合、`finally` 節は `try` 文が完了する前の最後のタスクとして実行されます。`finally` 節は、`try` 文が例外を生成したかどうかに関わらず実行されます。以下の点は、例外が発生した場合のより複雑なケースについて説明します。

*   `try` 節の実行中に例外が発生した場合、その例外は `except` 節によって処理されるかもしれません。例外が `except` 節によって処理されない場合、`finally` 節が実行された後に例外は再送出されます。
*   `except` または `else` 節の実行中に例外が発生する可能性があります。その場合も、例外は `finally` 節が実行された後に再送出されます。
*   `finally` 節が `break`、`continue`、`return` 文を実行する場合、例外は再送出されません。
*   `try` 文が `break`、`continue`、`return` 文に到達した場合、`finally` 節は `break`、`continue`、`return` 文が実行される直前に実行されます。
*   `finally` 節に `return` 文が含まれている場合、返される値は `try` 節の `return` 文からのものではなく、`finally` 節の `return` 文からのものになります。

例えば、

```python
>>> def bool_return():
...     try:
...         return True
...     finally:
...         return False
...
>>> bool_return()
False
```

より複雑な例です。

```python
>>> def divide(x, y):
...     try:
...         result = x / y
...     except ZeroDivisionError:
...         print("division by zero!")
...     else:
...         print("result is", result)
...     finally:
...         print("executing finally clause")
...
>>> divide(2, 1)
result is 2.0
executing finally clause
>>> divide(2, 0)
division by zero!
executing finally clause
>>> divide("2", "1")
executing finally clause
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in divide
TypeError: unsupported operand type(s) for /: 'str' and 'str'
```
ご覧のように、`finally` 節はどんな場合でも実行されます。2つの文字列を割ることによって発生した `TypeError` は、`except` 節では処理されず、したがって `finally` 節が実行された後に再送出されます。

実際のアプリケーションでは、`finally` 節は、リソースの使用が成功したかどうかに関わらず、外部リソース（ファイルやネットワーク接続など）を解放するのに役立ちます。

### 8.8. 事前に定義されたクリーンアップアクション

一部のオブジェクトは、そのオブジェクトが不要になったときに、そのオブジェクトを使用する操作が成功したか失敗したかに関わらず、実行されるべき標準的なクリーンアップアクションを定義しています。ファイルを開いてその内容を画面に表示しようとする次の例を見てください。

```python
for line in open("myfile.txt"):
    print(line, end="")
```
このコードの問題点は、コードのこの部分の実行が終わった後、ファイルが不確定な時間開いたままになることです。これは単純なスクリプトでは問題になりませんが、大規模なアプリケーションでは問題になる可能性があります。`with` 文を使うと、ファイルのようなオブジェクトを、常に迅速かつ正しくクリーンアップされることを保証する方法で使用できます。

```python
with open("myfile.txt") as f:
    for line in f:
        print(line, end="")
```

この文が実行された後、たとえ行の処理中に問題が発生したとしても、ファイル `f` は常にクローズされます。ファイルのように、事前に定義されたクリーンアップアクションを提供するオブジェクトは、そのドキュメントにその旨が記載されています。