<!-- claude_translate/tutorial_004.md -->

# 4. もっと制御フローツール

先ほど紹介した `while` 文以外にも、Pythonは他の言語でおなじみの制御フロー文を使うよ。ただし、ちょっとしたひねりがあるんだ!

## 4.1. if文

たぶん一番有名な文の型は `if` 文だよね。

**例:**
```python
>>> x = int(input("Please enter an integer: "))
Please enter an integer: 42
>>> if x < 0:
...     x = 0
...     print('Negative changed to zero')
... elif x == 0:
...     print('Zero')
... elif x == 1:
...     print('Single')
... else:
...     print('More')
...
More
```

**ポイント:**
- `elif` 部分は0個以上使える
- `else` 部分はオプション(なくてもOK)
- `elif` は「else if」の省略形で、過度なインデントを避けるのに便利
- `if ... elif ... elif ...` のシーケンスは、他の言語の `switch` 文や `case` 文の代わりになる

## 4.2. for文

Pythonの `for` 文は、CやPascalで慣れてるものとちょっと違うんだ。

**他の言語との違い:**
- **Pascal**: いつも数値の算術進行(1, 2, 3...)で繰り返す
- **C**: 反復ステップと停止条件を両方ユーザーが定義
- **Python**: **任意のシーケンス(リストや文字列)の項目を、登場順に繰り返す**

**例:**
```python
>>> # いくつかの文字列を測定:
... words = ['cat', 'window', 'defenestrate']
>>> for w in words:
...     print(w, len(w))
...
cat 3
window 6
defenestrate 12
```

### 繰り返し中のコレクション変更の注意点

同じコレクションを繰り返しながら変更するコードは、正しく動かすのが難しい。

**代わりに、こうしよう:**

**戦略1: コレクションのコピーを繰り返す**
```python
# 戦略: コピーを繰り返す
for user, status in users.copy().items():
    if status == 'inactive':
        del users[user]
```

**戦略2: 新しいコレクションを作成**
```python
# 戦略: 新しいコレクションを作る
active_users = {}
for user, status in users.items():
    if status == 'active':
        active_users[user] = status
```

## 4.3. range()関数

数値のシーケンスを繰り返す必要がある時は、組み込み関数 `range()` が便利!

**算術進行を生成:**
```python
>>> for i in range(5):
...     print(i)
...
0
1
2
3
4
```

**重要:** 
- 指定された終点は生成されるシーケンスに**含まれない**
- `range(10)` は10個の値(0〜9)を生成する
- これは長さ10のシーケンスの有効なインデックス

### range()のオプション

**別の数から始める:**
```python
>>> list(range(5, 10))
[5, 6, 7, 8, 9]
```

**ステップ(増分)を指定:**
```python
>>> list(range(0, 10, 3))
[0, 3, 6, 9]
```

**負のステップも使える:**
```python
>>> list(range(-10, -100, -30))
[-10, -40, -70]
```

### シーケンスのインデックスを繰り返す

`range()` と `len()` を組み合わせる:

```python
>>> a = ['Mary', 'had', 'a', 'little', 'lamb']
>>> for i in range(len(a)):
...     print(i, a[i])
...
0 Mary
1 had
2 a
3 little
4 lamb
```

**でも、ほとんどの場合は `enumerate()` 関数の方が便利!**
(後の「ループのテクニック」セクションで詳しくやるよ)

### range()の不思議な動作

rangeをそのまま表示すると:

```python
>>> range(10)
range(0, 10)
```

**range()が返すオブジェクト:**
- リストのように振る舞うけど、実際にはリストじゃない
- 繰り返す時に、望ましいシーケンスの連続した項目を返すオブジェクト
- 実際にリストを作らないから、スペースを節約できる!

**こういうオブジェクトを「iterable(反復可能)」と呼ぶ:**
- 供給が尽きるまで連続した項目を取得できるものが期待される関数や構文のターゲットとして適してる

**iterableを取る関数の例:**
```python
>>> sum(range(4))  # 0 + 1 + 2 + 3
6
```

後でiterableを返す関数や、iterableを引数に取る関数をもっと見ていくよ。「データ構造」の章で `list()` について詳しくやるね!

## 4.4. break文、continue文、ループのelse節

### break文

Cと同じように、最も内側の `for` または `while` ループから抜け出す。

### ループのelse節

**ループ文には `else` 節を付けられる:**

**いつ実行される?**
- `for`の場合: iterableを使い果たした時
- `while`の場合: 条件が偽になった時
- **`break` 文でループが終了した時は実行されない**

**例: 素数を探す**
```python
>>> for n in range(2, 10):
...     for x in range(2, n):
...         if n % x == 0:
...             print(n, 'equals', x, '*', n//x)
...             break
...     else:
...         # ループが因数を見つけずに最後まで行った
...         print(n, 'is a prime number')
...
2 is a prime number
3 is a prime number
4 equals 2 * 2
5 is a prime number
6 equals 2 * 3
7 is a prime number
8 equals 2 * 4
9 equals 3 * 3
```

**注意:** `else` 節は `for` ループに属してて、`if` 文には属してない!

**覚え方:**
- ループの `else` 節は、`try` 文の `else` 節に近い
- `try` の `else`: 例外が発生しなかった時に実行
- ループの `else`: `break` が起こらなかった時に実行

### continue文

Cから借りた文。ループの次の反復を続ける:

```python
>>> for num in range(2, 10):
...     if num % 2 == 0:
...         print("Found an even number", num)
...         continue
...     print("Found an odd number", num)
...
Found an even number 2
Found an odd number 3
Found an even number 4
Found an odd number 5
Found an even number 6
Found an odd number 7
Found an even number 8
Found an odd number 9
```

## 4.5. pass文

`pass` 文は**何もしない**。

**いつ使う?**
- 文が構文的に必要だけど、プログラムは何もする必要がない時

**例1: キーボード割り込み待ち**
```python
>>> while True:
...     pass  # Ctrl+Cのキーボード割り込みを待つビジーウェイト
...
```

**例2: 最小限のクラスを作成**
```python
>>> class MyEmptyClass:
...     pass
...
```

**例3: プレースホルダー**
新しいコードを書いてる時、関数や条件本体のプレースホルダーとして使える。より抽象的なレベルで考え続けられる。

```python
>>> def initlog(*args):
...     pass  # これを実装するのを忘れないように!
...
```

`pass` は静かに無視されるよ。

## 4.6. 関数の定義

任意の境界までフィボナッチ数列を書く関数を作れるよ:

```python
>>> def fib(n):    # nまでのフィボナッチ数列を書く
...     """Print a Fibonacci series up to n."""
...     a, b = 0, 1
...     while a < n:
...         print(a, end=' ')
...         a, b = b, a+b
...     print()
...
>>> # 今定義した関数を呼び出す:
... fib(2000)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597
```

### 関数定義の構文

**キーワード `def`:**
- 関数定義を導入
- その後に関数名と仮引数のリストを括弧で囲んだものが続く
- 関数本体の文は次の行から始まり、インデントが必要

**ドキュメント文字列(docstring):**
- 関数本体の最初の文は、文字列リテラルでもOK
- これが関数のドキュメント文字列(docstring)
- ドキュメントを自動生成したり、ユーザーが対話的にコードを閲覧できるツールがある
- **コードにdocstringを含めるのは良い習慣!習慣にしよう**

### 変数のスコープ

**関数の実行:**
- ローカル変数用の新しいシンボルテーブルが導入される

**変数の代入:**
- すべての変数代入は、ローカルシンボルテーブルに値を格納

**変数の参照:**
1. ローカルシンボルテーブルを見る
2. 外側の関数のローカルシンボルテーブルを見る
3. グローバルシンボルテーブルを見る
4. 組み込み名前のテーブルを見る

**重要:**
- グローバル変数や外側の関数の変数は、関数内で直接値を代入できない
- ただし例外がある:
  - グローバル変数: `global` 文で指定すればOK
  - 外側の関数の変数: `nonlocal` 文で指定すればOK
- でも参照はできる

### 引数の受け渡し

**関数呼び出し時:**
- 実引数(引数)は、呼び出された関数のローカルシンボルテーブルに導入される
- 引数は**call by value**で渡される
  - ただし、値は常にオブジェクト参照(オブジェクトの値じゃない)

**再帰呼び出し:**
- 関数が別の関数を呼び出すか、自分自身を再帰的に呼び出す時
- その呼び出しのために新しいローカルシンボルテーブルが作られる

### 関数オブジェクト

関数定義は、現在のシンボルテーブルで関数名を関数オブジェクトに関連付ける。

**関数オブジェクトは他の名前にも割り当てられる:**
```python
>>> fib
<function fib at 10042ed0>
>>> f = fib
>>> f(100)
0 1 1 2 3 5 8 13 21 34 55 89
```

**他の言語からの視点:**
- `fib` は値を返さないから、関数じゃなくてプロシージャ(手続き)じゃない?
- 実は、`return` 文がない関数でも値を返す(つまらない値だけど)
- その値は `None`(組み込み名前)
- インタープリタは通常、唯一書かれる値なら `None` の表示を抑制する

**確認したい場合:**
```python
>>> fib(0)
>>> print(fib(0))
None
```

### 値を返す関数

フィボナッチ数列の数値のリストを返す関数を書くのも簡単:

```python
>>> def fib2(n):  # nまでのフィボナッチ数列を返す
...     """Return a list containing the Fibonacci series up to n."""
...     result = []
...     a, b = 0, 1
...     while a < n:
...         result.append(a)  # 下記参照
...         a, b = b, a+b
...     return result
...
>>> f100 = fib2(100)    # 呼び出す
>>> f100                # 結果を書く
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```

**この例の新しいPython機能:**

1. **`return` 文:**
   - 関数から値を返して戻る
   - 式引数なしの `return` は `None` を返す
   - 関数の終わりまで落ちても `None` を返す

2. **メソッド `result.append(a)`:**
   - リストオブジェクト `result` のメソッドを呼び出してる
   - メソッド = オブジェクトに「属する」関数
   - 記法: `obj.methodname`(objはオブジェクト、methodnameはメソッド名)
   - 異なる型は異なるメソッドを定義
   - 異なる型のメソッドが同じ名前でも曖昧さなし
   - 独自のオブジェクト型とメソッドは、クラスを使って定義できる(後の「クラス」章で)
   - `append()` メソッドはリストオブジェクトに定義されてる
   - リストの最後に新しい要素を追加
   - この例では `result = result + [a]` と同等だけど、もっと効率的!

## 4.7. もっと関数の定義について

可変個の引数を持つ関数も定義できる。3つの形式があって、組み合わせられるよ。

### 4.7.1. デフォルト引数値

一番便利な形式は、1つ以上の引数にデフォルト値を指定すること。定義されてる数より少ない引数で呼び出せる関数が作れる。

**例:**
```python
def ask_ok(prompt, retries=4, reminder='Please try again!'):
    while True:
        ok = input(prompt)
        if ok in ('y', 'ye', 'yes'):
            return True
        if ok in ('n', 'no', 'nop', 'nope'):
            return False
        retries = retries - 1
        if retries < 0:
            raise ValueError('invalid user response')
        print(reminder)
```

**呼び出し方はいろいろ:**

1. 必須引数だけ: `ask_ok('Do you really want to quit?')`
2. オプション引数1つ: `ask_ok('OK to overwrite the file?', 2)`
3. すべての引数: `ask_ok('OK to overwrite the file?', 2, 'Come on, only yes or no!')`

この例では `in` キーワードも紹介してる。シーケンスに特定の値が含まれてるかテストする。

### デフォルト値の評価タイミング

デフォルト値は、**関数定義の時点**で、定義スコープで評価される:

```python
i = 5

def f(arg=i):
    print(arg)

i = 6
f()
```

これは `5` を表示する。

### 重要な警告: ミュータブルなデフォルト値

**デフォルト値は1回だけ評価される!**

デフォルトがミュータブルオブジェクト(リスト、辞書、ほとんどのクラスのインスタンス)の場合、違いが出る:

**問題の例:**
```python
def f(a, L=[]):
    L.append(a)
    return L

print(f(1))
print(f(2))
print(f(3))
```

**出力:**
```
[1]
[1, 2]
[1, 2, 3]
```

**後続の呼び出しでデフォルトを共有したくない場合:**
```python
def f(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L
```

### 4.7.2. キーワード引数

関数は `kwarg=value` 形式の**キーワード引数**でも呼び出せる。

**例:**
```python
def parrot(voltage, state='a stiff', action='voom', type='Norwegian Blue'):
    print("-- This parrot wouldn't", action, end=' ')
    print("if you put", voltage, "volts through it.")
    print("-- Lovely plumage, the", type)
    print("-- It's", state, "!")
```

**1つの必須引数(`voltage`)と3つのオプション引数**

**有効な呼び出し方:**
```python
parrot(1000)                                          # 1位置引数
parrot(voltage=1000)                                  # 1キーワード引数
parrot(voltage=1000000, action='VOOOOOM')             # 2キーワード引数
parrot(action='VOOOOOM', voltage=1000000)             # 2キーワード引数
parrot('a million', 'bereft of life', 'jump')         # 3位置引数
parrot('a thousand', state='pushing up the daisies')  # 1位置、1キーワード
```

**無効な呼び出し:**
```python
parrot()                     # 必須引数がない
parrot(voltage=5.0, 'dead')  # キーワード引数の後に非キーワード引数
parrot(110, voltage=220)     # 同じ引数に重複した値
parrot(actor='John Cleese')  # 未知のキーワード引数
```

**ルール:**
- 関数呼び出しで、キーワード引数は位置引数の**後**に来る
- 渡されるすべてのキーワード引数は、関数が受け入れる引数のどれかと一致しないといけない
  - 例: `actor` は `parrot` 関数の有効な引数じゃない
- 順序は重要じゃない
- 非オプション引数も含まれる
  - 例: `parrot(voltage=1000)` も有効
- どの引数も値を2回以上受け取れない

**エラー例:**
```python
>>> def function(a):
...     pass
...
>>> function(0, a=0)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: function() got multiple values for argument 'a'
```

### **name と ***name

**`**name` 形式の最終仮引数がある時:**
- 仮引数に対応しないすべてのキーワード引数を含む辞書を受け取る

**`*name` 形式の仮引数と組み合わせ可能:**
- 仮引数リストを超える位置引数を含むタプルを受け取る
- `*name` は `**name` の前に来る

**例:**
```python
def cheeseshop(kind, *arguments, **keywords):
    print("-- Do you have any", kind, "?")
    print("-- I'm sorry, we're all out of", kind)
    for arg in arguments:
        print(arg)
    print("-" * 40)
    for kw in keywords:
        print(kw, ":", keywords[kw])
```

**呼び出し:**
```python
cheeseshop("Limburger", "It's very runny, sir.",
           "It's really very, VERY runny, sir.",
           shopkeeper="Michael Palin",
           client="John Cleese",
           sketch="Cheese Shop Sketch")
```

**出力:**
```
-- Do you have any Limburger ?
-- I'm sorry, we're all out of Limburger
It's very runny, sir.
It's really very, VERY runny, sir.
----------------------------------------
shopkeeper : Michael Palin
client : John Cleese
sketch : Cheese Shop Sketch
```

キーワード引数が表示される順序は、関数呼び出しで提供された順序と一致することが保証されてる!

### 4.7.3. 特殊パラメータ

デフォルトでは、引数はPython関数に位置または明示的にキーワードで渡せる。

**読みやすさとパフォーマンスのため:**
引数を渡す方法を制限するのが理にかなってる。開発者は関数定義を見るだけで、項目が位置で渡されるか、位置またはキーワードか、キーワードかを判断できる。

**関数定義の形:**
```python
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
      -----------    ----------     ----------
       |                  |                  |
       |       位置またはキーワード          |
       |                                - キーワードのみ
       -- 位置のみ
```

**`/` と `*` はオプション:**
- これらの記号は、引数を関数に渡す方法の種類を示す
- 位置のみ、位置またはキーワード、キーワードのみ

#### 4.7.3.1. 位置またはキーワード引数

`/` と `*` が関数定義にない場合、引数は位置またはキーワードで関数に渡せる。

#### 4.7.3.2. 位置のみパラメータ

位置のみとしてマークできる。位置のみの場合:
- パラメータの順序が重要
- キーワードで渡せない

**`/` (フォワードスラッシュ)の前に配置:**
- `/` は位置のみパラメータと残りのパラメータを論理的に分離
- 関数定義に `/` がない場合、位置のみパラメータはない
- `/` に続くパラメータは、位置またはキーワード、またはキーワードのみ

#### 4.7.3.3. キーワードのみ引数

キーワードのみとしてマークするには、引数リストの最初のキーワードのみパラメータの直前に `*` を配置。

#### 4.7.3.4. 関数の例

**`/` と `*` のマーカーに注目:**

```python
>>> def standard_arg(arg):
...     print(arg)
...
>>> def pos_only_arg(arg, /):
...     print(arg)
...
>>> def kwd_only_arg(*, arg):
...     print(arg)
...
>>> def combined_example(pos_only, /, standard, *, kwd_only):
...     print(pos_only, standard, kwd_only)
```

**1つ目: standard_arg**
制限なし、位置でもキーワードでもOK:

```python
>>> standard_arg(2)
2
>>> standard_arg(arg=2)
2
```

**2つ目: pos_only_arg**
位置パラメータのみ(`/`がある):

```python
>>> pos_only_arg(1)
1
>>> pos_only_arg(arg=1)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: pos_only_arg() got some positional-only arguments passed as keyword arguments: 'arg'
```

**3つ目: kwd_only_arg**
キーワード引数のみ(`*`がある):

```python
>>> kwd_only_arg(3)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: kwd_only_arg() takes 0 positional arguments but 1 was given
>>> kwd_only_arg(arg=3)
3
```

**4つ目: combined_example**
3つすべての呼び出し規約を使う:

```python
>>> combined_example(1, 2, 3)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: combined_example() takes 2 positional arguments but 3 were given

>>> combined_example(1, 2, kwd_only=3)
1 2 3

>>> combined_example(1, standard=2, kwd_only=3)
1 2 3

>>> combined_example(pos_only=1, standard=2, kwd_only=3)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: combined_example() got some positional-only arguments passed as keyword arguments: 'pos_only'
```

**名前の衝突の可能性:**

```python
def foo(name, **kwds):
    return 'name' in kwds
```

キーワード `'name'` が常に最初のパラメータにバインドされるから、`True` を返す呼び出しはない:

```python
>>> foo(1, **{'name': 2})
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: foo() got multiple values for argument 'name'
```

**でも `/` を使えば可能:**

```python
def foo(name, /, **kwds):
    return 'name' in kwds

>>> foo(1, **{'name': 2})
True
```

位置のみパラメータの名前は、`**kwds` で曖昧さなく使える!

#### 4.7.3.5. まとめ

**どのパラメータを使うか決める:**

```python
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
```

**ガイダンス:**

- **位置のみ**: パラメータ名をユーザーに公開したくない時
  - パラメータ名に実際の意味がない時
  - 引数の順序を強制したい時
  - 位置パラメータと任意のキーワードを取る時

- **キーワードのみ**: 名前に意味があって、明示的な名前で関数定義が理解しやすい時
  - ユーザーが引数の位置に依存するのを防ぎたい時

- **API用**: 位置のみを使って、将来パラメータ名が変更されてもAPI変更を防ぐ

### 4.7.4. 任意引数リスト

あまり使われないけど、関数を任意個の引数で呼び出せるように指定できる。

**これらの引数はタプルにまとめられる:**
```python
def write_multiple_items(file, separator, *args):
    file.write(separator.join(args))
```

**通常、可変引数は仮引数リストの最後:**
- 関数に渡される残りのすべての入力引数をすくい上げるから
- `*args` パラメータの後の仮引数は「キーワードのみ」引数
  - 位置引数じゃなくキーワードとしてのみ使える

```python
>>> def concat(*args, sep="/"):
...     return sep.join(args)
...
>>> concat("earth", "mars", "venus")
'earth/mars/venus'
>>> concat("earth", "mars", "venus", sep=".")
'earth.mars.venus'
```

### 4.7.5. 引数リストのアンパック

逆の状況もある。引数がすでにリストやタプルにあるけど、別々の位置引数を必要とする関数呼び出しのためにアンパックする必要がある。

**`*` 演算子でリストやタプルから引数をアンパック:**

```python
>>> list(range(3, 6))            # 別々の引数での通常呼び出し
[3, 4, 5]
>>> args = [3, 6]
>>> list(range(*args))           # リストからアンパックした引数での呼び出し
[3, 4, 5]
```

**同様に、辞書は `**` 演算子でキーワード引数を提供できる:**

```python
>>> def parrot(voltage, state='a stiff', action='voom'):
...     print("-- This parrot wouldn't", action, end=' ')
...     print("if you put", voltage, "volts through it.", end=' ')
...     print("E's", state, "!")
...
>>> d = {"voltage": "four million", "state": "bleedin' demised", "action": "VOOM"}
>>> parrot(**d)
-- This parrot wouldn't VOOM if you put four million volts through it. E's bleedin' demised !
```

### 4.7.6. ラムダ式

`lambda` キーワードで小さな無名関数を作れる。

**例: 2つの引数の合計を返す関数**
```python
lambda a, b: a+b
```

**ラムダ関数の使い道:**
- 関数オブジェクトが必要な場所ならどこでも使える
- 構文的に単一の式に制限される
- 意味的には、通常の関数定義の糖衣構文(シンタックスシュガー)
- ネストした関数定義と同様に、ラムダ関数は含むスコープの変数を参照できる

**例1: 関数を返す**
```python
>>> def make_incrementor(n):
...     return lambda x: x + n
...
>>> f = make_incrementor(42)
>>> f(0)
42
>>> f(1)
43
```

**例2: 小さな関数を引数として渡す**
```python
>>> pairs = [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four')]
>>> pairs.sort(key=lambda pair: pair[1])
>>> pairs
[(4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]
```

### 4.7.7. ドキュメント文字列

ドキュメント文字列の内容と書式に関する慣習:

**1行目:**
- 常にオブジェクトの目的の短く簡潔な要約
- 簡潔さのため、オブジェクトの名前や型を明示的に述べない
  - 他の手段で利用可能だから(名前が関数の操作を記述する動詞の場合は除く)
- 大文字で始まり、ピリオドで終わる

**2行目以降がある場合:**
- 2行目は空白にして、要約と残りの説明を視覚的に分離
- 後続の行は、オブジェクトの呼び出し規約、副作用などを記述する1つ以上の段落

**インデント処理:**
- Pythonパーサーは複数行文字列リテラルからインデントを削除しない
- ドキュメントを処理するツールは、必要に応じてインデントを削除する
- 以下の慣習を使う:
  - 文字列の最初の行の後の最初の非空白行が、ドキュメント文字列全体のインデント量を決定
  - このインデントと「等価」な空白が、文字列のすべての行の先頭から削除される
  - インデントが少ない行は発生すべきじゃないけど、発生したら先頭の空白をすべて削除
  - 空白の等価性は、タブ展開後(通常8スペース)にテストする

**例:**
```python
>>> def my_function():
...     """Do nothing, but document it.
...
...     No, really, it doesn't do anything.
...     """
...     pass
...
>>> print(my_function.__doc__)
Do nothing, but document it.

    No, really, it doesn't do anything.
```

### 4.7.8. 関数アノテーション

**関数アノテーション**は、ユーザー定義関数で使われる型に関する完全にオプションのメタデータ情報。

**保存場所:**
- 関数の `__annotations__` 属性に辞書として保存
- 関数の他の部分には何の影響もない

**構文:**
- **パラメータアノテーション**: パラメータ名の後にコロン、その後にアノテーションの値となる式
- **戻り値アノテーション**: リテラル `->` とその後の式、パラメータリストと `def` 文の終わりを示すコロンの間

**例:**
```python
>>> def f(ham: str, eggs: str = 'eggs') -> str:
...     print("Annotations:", f.__annotations__)
...     print("Arguments:", ham, eggs)
...     return ham + ' and ' + eggs
...
>>> f('spam')
Annotations: {'ham': <class 'str'>, 'return': <class 'str'>, 'eggs': <class 'str'>}
Arguments: spam eggs
'spam and eggs'
```

## 4.8. 間奏: コーディングスタイル

もっと長く複雑なPythonのコードを書こうとしてるから、コーディングスタイルについて話すいいタイミングだね。

**ほとんどの言語は異なるスタイルで書ける(またはフォーマットできる):**
- 読みやすいものもあれば、そうでないものもある
- 他の人があなたのコードを読みやすくするのは常に良いアイデア
- 素敵なコーディングスタイルを採用すると、それに大いに役立つ

**Python用は PEP 8:**
- ほとんどのプロジェクトが従うスタイルガイド
- 非常に読みやすく見た目に快いコーディングスタイルを促進
- すべてのPython開発者は、ある時点でこれを読むべき
- 最も重要なポイントを抜粋:

### PEP 8の重要ポイント

**1. 4スペースインデント、タブなし**
- 4スペースは、小さいインデント(より深いネストが可能)と大きいインデント(読みやすい)の良い妥協点
- タブは混乱を招くから、使わない方がいい

**2. 79文字を超えないように行を折り返す**
- 小さいディスプレイのユーザーを助ける
- 大きいディスプレイで複数のコードファイルを並べて表示できる

**3. 空行を使って関数やクラス、関数内の大きなコードブロックを分離**

**4. 可能な場合、コメントを独自の行に置く**

**5. ドキュメント文字列を使う**

**6. 演算子の周りとカンマの後にスペースを使う**
- でも、括弧構造の直接内側には使わない
- 例: `a = f(1, 2) + g(3, 4)`

**7. クラスと関数に一貫した名前を付ける**
- 慣習:
  - クラス: `UpperCamelCase`
  - 関数とメソッド: `lowercase_with_underscores`
  - 最初のメソッド引数の名前には常に `self` を使う
  - (クラスとメソッドについては後の「クラス入門」で詳しく)

**8. コードが国際的な環境で使われる場合、派手なエンコーディングを使わない**
- Pythonのデフォルト UTF-8、またはプレーンなASCIIが、どんな場合でも最適

**9. 識別子に非ASCII文字を使わない**
- 異なる言語を話す人がコードを読んだり保守したりする可能性が少しでもある場合

## 脚注

**1. オブジェクト参照による呼び出し:**
実際には、「オブジェクト参照による呼び出し」の方が良い説明。ミュータブルオブジェクトが渡された場合、呼び出し側は呼び出された側が行った変更(リストに挿入された項目など)を見ることができるから。

---

## この章の重要ポイントまとめ( ˶'ᵕ'˶)

**制御フロー:**
- `if`、`elif`、`else`
- `for` ループ(シーケンスを繰り返す)
- `while` ループ
- `break`(ループから抜ける)、`continue`(次の反復へ)
- ループの `else` 節(`break` で終了しなかった時に実行)

**関数:**
- `def` で定義
- `return` で値を返す
- デフォルト引数、キーワード引数
- `*args`(可変個の位置引数)、`**kwargs`(可変個のキーワード引数)
- 位置のみ(`/`)、キーワードのみ(`*`)パラメータ
- ラムダ式(無名関数)
- ドキュメント文字列(docstring)

**その他:**
- `range()` 関数
- `pass` 文(何もしない)
- コーディングスタイル(PEP 8)

次は5章いくよ〜!( ˶>ᴗ<˶)