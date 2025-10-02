<!-- claude_translate/tutorial_008.md -->

# 8. エラーと例外

これまでエラーメッセージは言及されただけだったけど、例を試してたらたぶんいくつか見てるよね。

**(少なくとも)2種類の区別できるエラーがある:**
- **構文エラー**
- **例外**

## 8.1. 構文エラー

**構文エラー(パース(解析)エラーとも呼ばれる):**
- Pythonを学んでる間、おそらく最もよく遭遇する苦情

**例:**

```python
>>> while True print('Hello world')
  File "<stdin>", line 1
    while True print('Hello world')
                   ^
SyntaxError: invalid syntax
```

**パーサーの動作:**
- 問題のある行を繰り返す
- エラーが検出された行の最も早い位置を指す小さな「矢印」を表示
- エラーは矢印の**前**のトークンで引き起こされる(または少なくとも検出される)
- この例では、関数 `print()` でエラーが検出される
  - その前にコロン(`':'`)がないから
- ファイル名と行番号が表示される
  - 入力がスクリプトから来た場合、どこを見ればいいか分かるように

## 8.2. 例外

**文や式が構文的に正しくても:**
- 実行しようとした時にエラーを引き起こすことがある

**実行中に検出されるエラーを「例外」という:**
- 無条件に致命的ではない
- Pythonプログラムでどう扱うかをすぐ学ぶよ
- ほとんどの例外はプログラムで処理されず、以下のようなエラーメッセージになる

**例:**

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

### エラーメッセージの読み方

**エラーメッセージの最後の行:**
- 何が起こったかを示す

**例外には異なる型がある:**
- 型がメッセージの一部として表示される
- この例の型: `ZeroDivisionError`, `NameError`, `TypeError`
- 例外型として表示される文字列 = 発生した組み込み例外の名前
- すべての組み込み例外でこれは真
- ユーザー定義例外では必ずしも真じゃない(でも便利な慣習)
- 標準例外名は組み込み識別子(予約キーワードじゃない)

**行の残りの部分:**
- 例外の型と原因に基づく詳細を提供

**エラーメッセージの前の部分:**
- スタックトレースバックの形式で、例外が発生したコンテキストを表示
- 一般的にはソース行をリストするスタックトレースバックを含む
- ただし、標準入力から読まれた行は表示しない

「Built-in Exceptions」に組み込み例外とその意味がリストされてるよ。

## 8.3. 例外の処理

**選択された例外を処理するプログラムを書くことが可能:**

以下の例を見て。有効な整数が入力されるまでユーザーに入力を求めるけど、プログラムの割り込み(Control-Cまたはオペレーティングシステムがサポートするもの)を許可する。

**注意:** ユーザー生成の割り込みは、`KeyboardInterrupt` 例外を発生させることで通知される。

```python
>>> while True:
...     try:
...         x = int(input("Please enter a number: "))
...         break
...     except ValueError:
...         print("Oops!  That was no valid number.  Try again...")
...
```

### try文の動作

**`try` 文は以下のように動く:**

1. **まず、try節(tryとexceptキーワード間の文)を実行**

2. **例外が発生しない場合:**
   - except節はスキップ
   - try文の実行が終了

3. **try節の実行中に例外が発生した場合:**
   - 節の残りはスキップ
   - その型がexceptキーワードの後に名前付けられた例外と一致する場合:
     - except節が実行される
     - その後、try文の後で実行が続く

4. **except節で名前付けられた例外と一致しない例外が発生した場合:**
   - 外側のtry文に渡される
   - ハンドラーが見つからない場合:
     - 未処理の例外となり
     - 上記のようなメッセージで実行が停止

### 複数のexcept節

**`try` 文には複数のexcept節を持てる:**
- 異なる例外のハンドラーを指定
- 最大で1つのハンドラーが実行される
- ハンドラーは対応するtry節で発生する例外のみ処理
  - 同じtry文の他のハンドラー内では処理しない

**except節は複数の例外を括弧付きタプルで名前付けできる:**

```python
... except (RuntimeError, TypeError, NameError):
...     pass
```

### 例外の継承

**except節のクラスは、例外と互換性がある場合:**
- 同じクラスまたはその基底クラス
- (逆は違う — 派生クラスをリストするexcept節は基底クラスと互換性がない)

**例:**

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

これは順番に B, C, D を表示する。

**注意:** except節が逆順(except Bが最初)だった場合、B, B, B と表示される
- 最初にマッチするexcept節がトリガーされる

### ワイルドカードexcept

**最後のexcept節は例外名を省略できる:**
- ワイルドカードとして機能
- **極めて慎重に使おう!**
  - 本物のプログラミングエラーを簡単にマスクできるから
- エラーメッセージを表示してから例外を再発生させるのにも使える
  - 呼び出し側も例外を処理できるように

```python
import sys

try:
    f = open('myfile.txt')
    s = f.readline()
    i = int(s.strip())
except OSError as err:
    print("OS error: {0}".format(err))
except ValueError:
    print("Could not convert data to an integer.")
except:
    print("Unexpected error:", sys.exc_info()[0])
    raise
```

### try...else文

**`try ... except` 文にはオプションのelse節がある:**
- 存在する場合、すべてのexcept節の後に続く必要がある
- try節が例外を発生させない場合に実行されなければならないコードに便利

**例:**

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

**`else` 節を使う方が良い理由:**
- try節に追加のコードを追加するより
- `try ... except` 文で保護されるコードによって発生しなかった例外を誤ってキャッチするのを避けられる

### 例外の引数

**例外が発生すると:**
- 関連する値を持つことがある(例外の引数とも呼ばれる)
- 引数の有無と型は例外の型に依存

**except節は例外名の後に変数を指定できる:**
- 変数は例外インスタンスにバインドされる
- 引数は `instance.args` に格納される
- 便宜上、例外インスタンスは `__str__()` を定義してる
  - `.args` を参照せずに引数を直接表示できる
- 例外を発生させる前にインスタンス化して、望む属性を追加することもできる

```python
>>> try:
...     raise Exception('spam', 'eggs')
... except Exception as inst:
...     print(type(inst))    # 例外インスタンス
...     print(inst.args)     # .argsに格納された引数
...     print(inst)          # __str__で引数を直接表示
...                          # でも例外サブクラスでオーバーライドされるかも
...     x, y = inst.args     # argsをアンパック
...     print('x =', x)
...     print('y =', y)
...
<class 'Exception'>
('spam', 'eggs')
('spam', 'eggs')
x = spam
y = eggs
```

**未処理の例外の場合:**
- 引数がある場合、メッセージの最後の部分('detail')として表示される

### ネストした関数の例外

**例外ハンドラーは:**
- try節で直接発生する例外だけじゃなく
- try節で呼ばれる(間接的にでも)関数内で発生する例外も処理

**例:**

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

## 8.4. 例外の発生

**`raise` 文:**
- プログラマーが指定された例外を強制的に発生させられる

**例:**

```python
>>> raise NameError('HiThere')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: HiThere
```

**`raise` への唯一の引数:**
- 発生させる例外を示す
- 例外インスタンスまたは例外クラス(`Exception` から派生したクラス)でなければならない
- 例外クラスが渡された場合:
  - 引数なしでコンストラクターを呼び出して暗黙的にインスタンス化される

```python
raise ValueError  # 'raise ValueError()' の省略形
```

### 例外の再発生

**例外が発生したかどうかを判断する必要があるけど、処理する意図がない場合:**
- よりシンプルな形式の `raise` 文で例外を再発生させられる

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

## 8.5. 例外の連鎖

**`raise` 文にはオプションの `from` がある:**
- 例外の連鎖を可能にする

**例:**

```python
# exc は例外インスタンスまたはNoneでなければならない
raise RuntimeError from exc
```

**例外を変換する時に便利:**

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

**自動的な例外連鎖:**
- exceptまたはfinally節内で例外が発生すると、自動的に連鎖が起こる

**例外連鎖の無効化:**
- `from None` イディオムを使う

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

連鎖のメカニズムについて詳しくは「Built-in Exceptions」を見てね。

## 8.6. ユーザー定義例外

**プログラムは独自の例外に名前を付けられる:**
- 新しい例外クラスを作成することで
- (Pythonクラスについては「クラス」を見てね)

**例外は通常 `Exception` クラスから派生:**
- 直接的または間接的に

**例外クラスは:**
- 他のクラスができることなら何でも定義できる
- でも通常シンプルに保たれる
- ハンドラーがエラーに関する情報を抽出できるように、いくつかの属性を提供するだけのことが多い

**ほとんどの例外は "Error" で終わる名前で定義される:**
- 標準例外の命名と似てる

**多くの標準モジュールは独自の例外を定義:**
- 定義する関数で発生する可能性のあるエラーを報告するため

クラスについてもっと詳しくは「クラス」の章で!

## 8.7. クリーンアップアクションの定義

**`try` 文にはもう1つのオプション節がある:**
- すべての状況で実行されなければならないクリーンアップアクションを定義するため

**例:**

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

### finally節の動作

**`finally` 節が存在する場合:**
- `try` 文が完了する前の最後のタスクとして実行される
- `try` 文が例外を発生させるかどうかに関わらず実行される

**より複雑なケース:**

1. **try節の実行中に例外が発生した場合:**
   - 例外はexcept節で処理されるかも
   - except節で処理されない場合、finally節が実行された後に例外が再発生

2. **exceptまたはelse節の実行中に例外が発生する可能性:**
   - やはり、finally節が実行された後に例外が再発生

3. **finally節が `break`、`continue`、`return` 文を実行した場合:**
   - 例外は再発生されない

4. **try文が `break`、`continue`、`return` 文に達した場合:**
   - finally節はbreak、continue、returnの実行の直前に実行される

5. **finally節に `return` 文が含まれる場合:**
   - 返される値はfinally節のreturn文からの値
   - try節のreturn文からの値ではない

**例:**

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

### より複雑な例

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

**見ての通り:**
- `finally` 節はどんな場合でも実行される
- 2つの文字列を割ることで発生した `TypeError` はexcept節で処理されない
- だからfinally節が実行された後に再発生

**実際のアプリケーションでは:**
- `finally` 節は外部リソース(ファイルやネットワーク接続など)を解放するのに便利
- リソースの使用が成功したかどうかに関わらず

## 8.8. 事前定義されたクリーンアップアクション

**一部のオブジェクトは標準的なクリーンアップアクションを定義してる:**
- オブジェクトが不要になった時に実行される
- オブジェクトを使う操作が成功したか失敗したかに関わらず

**以下の例を見て:**
- ファイルを開いて、その内容を画面に表示しようとする

```python
for line in open("myfile.txt"):
    print(line, end="")
```

**このコードの問題:**
- コードのこの部分が実行を終えた後、ファイルが不定の時間開いたままになる
- シンプルなスクリプトでは問題じゃないけど、大きなアプリケーションでは問題になりうる

### with文の使用

**`with` 文:**
- ファイルのようなオブジェクトを、常に迅速かつ正しくクリーンアップされる方法で使える

```python
with open("myfile.txt") as f:
    for line in f:
        print(line, end="")
```

**文が実行された後:**
- 行の処理中に問題が発生しても、ファイル `f` は常に閉じられる

**事前定義されたクリーンアップアクションを提供するオブジェクト:**
- ファイルのように
- ドキュメントでこれを示す

---

## この章の重要ポイントまとめ( ˶'ᵕ'˶)

### エラーの種類
- **構文エラー**: コードを実行する前に検出される
- **例外**: 実行中に発生するエラー

### 例外処理
- **`try ... except`**: 例外をキャッチ
- **`try ... except ... else`**: 例外がない場合に実行
- **`try ... except ... finally`**: 必ず実行される
- **複数のexcept節**: 異なる例外を個別に処理

### 例外の発生
- **`raise`**: 例外を発生させる
- **`raise` (引数なし)**: 例外を再発生
- **`raise ... from ...`**: 例外の連鎖

### ベストプラクティス
- 特定の例外をキャッチ(ワイルドカードexceptは避ける)
- `with` 文でリソース管理
- `finally` でクリーンアップ
- ユーザー定義例外は `Exception` から派生

---

## 📝 この章の重要ポイント

### 🎯 試験頻出ポイント
- **例外の種類**: `SyntaxError`、`NameError`、`TypeError`、`ValueError`、`IndexError`
- **例外処理**: `try`、`except`、`else`、`finally`
- **例外の発生**: `raise`文、`raise Exception("message")`
- **ユーザー定義例外**: `Exception`クラスから継承
- **`finally`節**: 例外の有無に関わらず必ず実行

### 💡 覚えておくべきキーワード
- **例外階層**: `BaseException` → `Exception` → 具体的な例外
- **複数例外のキャッチ**: `except (TypeError, ValueError):`
- **例外情報の取得**: `except Exception as e:`
- **`else`節**: 例外が発生しなかった時に実行
- **クリーンアップ**: `finally`でリソースの解放

### ⚡ よくある間違い
- **`except:`の乱用**: 具体的な例外を指定する
- **例外を無視**: 最低限ログ出力やエラーメッセージを表示
- **`BaseException`をキャッチ**: `KeyboardInterrupt`なども捕捉してしまう
- **`finally`での`return`**: 例外を隠してしまう可能性

---

**次の章**: [9. クラス](tutorial_009.md)