<!-- translate/tutorial_007.md -->

## 7. 入力と出力

プログラムの出力を表現する方法はいくつかあります。データを人間が読みやすい形式で表示したり、後で使うためにファイルに書き出したりできます。この章では、そのいくつかの可能性について説明します。

### 7.1. より凝った出力フォーマット

これまでに、値を書き出す2つの方法、つまり式文と`print()`関数に出会いました。（3番目の方法はファイルオブジェクトの`write()`メソッドを使うことです。標準出力ファイルは`sys.stdout`として参照できます。詳細はライブラリリファレンスを参照してください。）

多くの場合、単にスペースで区切られた値を表示するよりも、出力のフォーマットを細かく制御したいと思うでしょう。出力をフォーマットする方法はいくつかあります。

*   **書式化済み文字列リテラル（f-string）**を使うには、文字列を開始のクォーテーションマークまたは三重クォーテーションマークの前に `f` または `F` を付けます。この文字列の中では、`{` と `}` の文字の間に、変数やリテラル値を参照できるPythonの式を書くことができます。

    ```python
    >>> year = 2016
    >>> event = 'Referendum'
    >>> f'Results of the {year} {event}'
    'Results of the 2016 Referendum'
    ```

*   文字列の **`str.format()` メソッド**は、もう少し手作業が必要です。変数が代入される場所を `{` と `}` でマークし、詳細な書式指定ディレクティブを提供できる点は同じですが、フォーマットされる情報も自分で提供する必要があります。

    ```python
    >>> yes_votes = 42_572_654
    >>> no_votes = 43_132_495
    >>> percentage = yes_votes / (yes_votes + no_votes)
    >>> '{:-9} YES votes  {:2.2%}'.format(yes_votes, percentage)
    ' 42572654 YES votes  49.67%'
    ```

*   最後に、文字列のスライスや連結操作を使って、想像できるあらゆるレイアウトを自分で作り出すこともできます。`string` 型には、文字列を指定されたカラム幅にパディング（詰め物）するための便利な操作を行うメソッドがいくつかあります。

凝った出力は必要なく、デバッグ目的でいくつかの変数を素早く表示したいだけの場合は、`repr()` または `str()` 関数を使って任意の値
を文字列に変換できます。

`str()` 関数は、人間にとってかなり読みやすい値の表現を返すことを目的としています。一方、`repr()` は、インタプリタが読み取れるような表現を生成すること（または、同等の構文がない場合は`SyntaxError`を強制すること）を目的としています。人間が消費するための特定の表現を持たないオブジェクトの場合、`str()` は `repr()` と同じ値を返します。数値やリスト、辞書のような構造など、多くの値はどちらの関数を使っても同じ表現になります。特に文字列は、2つの異なる表現を持ちます。

いくつか例を挙げます。

```python
>>> s = 'Hello, world.'
>>> str(s)
'Hello, world.'
>>> repr(s)
"'Hello, world.'"
>>> str(1/7)
'0.14285714285714285'
>>> x = 10 * 3.25
>>> y = 200 * 200
>>> s = 'The value of x is ' + repr(x) + ', and y is ' + repr(y) + '...'
>>> print(s)
The value of x is 32.5, and y is 40000...
>>> # 文字列の repr() は、文字列をクォートで囲み、バックスラッシュを追加します
... hello = 'hello, world\n'
>>> hellos = repr(hello)
>>> print(hellos)
'hello, world\n'
>>> # repr() の引数は任意のPythonオブジェクトです
... repr((x, y, ('spam', 'eggs')))
"(32.5, 40000, ('spam', 'eggs'))"
```

#### 7.1.1. 書式化済み文字列リテラル（f-string）

書式化済み文字列リテラル（f-stringとも呼ばれます）を使うと、文字列の前に `f` または `F` を付け、式を `{expression}` として書くことで、Pythonの式の値を文字列に含めることができます。

式の後には、オプションで書式指定子を続けることができます。これにより、値がどのようにフォーマットされるかをより細かく制御できます。次の例では、円周率 `pi` を小数点以下3桁に丸めています。

```python
>>> import math
>>> print(f'The value of pi is approximately {math.pi:.3f}.')
The value of pi is approximately 3.142.
```

`:` の後に整数を渡すと、そのフィールドは最小でもその文字数分の幅を持つようになります。これは、表の桁を揃えるのに便利です。

```python
>>> table = {'Sjoerd': 4127, 'Jack': 4098, 'Dcab': 7678}
>>> for name, phone in table.items():
...     print(f'{name:10} ==> {phone:10d}')
...
Sjoerd     ==>       4127
Jack       ==>       4098
Dcab       ==>       7678
```

他の修飾子を使って、フォーマットされる前に値を変換することもできます。`!a` は `ascii()` を、`!s` は `str()` を、`!r` は `repr()` を適用します。

```python
>>> animals = 'eels'
>>> print(f'My hovercraft is full of {animals}.')
My hovercraft is full of eels.
>>> print(f'My hovercraft is full of {animals!r}.')
My hovercraft is full of 'eels'.
```

これらの書式仕様に関するリファレンスについては、「書式指定ミニ言語」のリファレンスガイドを参照してください。

#### 7.1.2. 文字列の `format()` メソッド

`str.format()` メソッドの基本的な使い方は次のようになります。

```python
>>> print('We are the {} who say "{}!"'.format('knights', 'Ni'))
We are the knights who say "Ni!"
```

角括弧とその中の文字（書式フィールドと呼ばれます）は、`str.format()` メソッドに渡されたオブジェクトに置き換えられます。角括弧の中の数字を使って、`str.format()` メソッドに渡されたオブジェクトの位置を参照することができます。

```python
>>> print('{0} and {1}'.format('spam', 'eggs'))
spam and eggs
>>> print('{1} and {0}'.format('spam', 'eggs'))
eggs and spam
```

`str.format()` メソッドでキーワード引数を使用する場合、その値は引数の名前を使って参照されます。

```python
>>> print('This {food} is {adjective}.'.format(
...       food='spam', adj