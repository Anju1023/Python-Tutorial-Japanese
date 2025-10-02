<!-- claude_translate/tutorial_010.md -->

# Python標準ライブラリ入門 Part1 - 詳しい解説版

## 10.1. オペレーティングシステムのインターフェース

### osモジュール

`os`モジュールは、オペレーティングシステムと対話するための**数十の関数**を提供しています。

**実例：**
```python
>>> import os
>>> os.getcwd()      # 現在の作業ディレクトリを返す
'C:\\Python39'
>>> os.chdir('/server/accesslogs')   # 現在の作業ディレクトリを変更
>>> os.system('mkdir today')   # システムシェルでmkdirコマンドを実行
0
```

### 重要な注意点

**必ず `import os` のスタイルを使用してください。**

`from os import *` は使わないでください。これは、`os.open()`が組み込みの`open()`関数を**隠してしまう（シャドーイング）**のを防ぐためです。この2つの関数は動作が大きく異なります。

### 大きなモジュールを扱うヘルパー関数

組み込みの`dir()`と`help()`関数は、`os`のような大きなモジュールを扱うための**インタラクティブな補助ツール**として役立ちます：

```python
>>> import os
>>> dir(os)
<すべてのモジュール関数のリストを返す>
>>> help(os)
<モジュールのdocstringから作成された広範なマニュアルページを返す>
```

---

### shutilモジュール - より高レベルなファイル操作

日常的なファイルとディレクトリの管理タスクには、`shutil`モジュールが**より高レベルで使いやすいインターフェース**を提供しています：

```python
>>> import shutil
>>> shutil.copyfile('data.db', 'archive.db')
'archive.db'
>>> shutil.move('/build/executables', 'installdir')
'installdir'
```

ファイルのコピーや移動が簡単にできるよ！( ˶'ᵕ'˶)

---

## 10.2. ファイルワイルドカード

### globモジュール

`glob`モジュールは、ディレクトリの**ワイルドカード検索**からファイルリストを作成する関数を提供します：

```python
>>> import glob
>>> glob.glob('*.py')
['primes.py', 'random.py', 'quote.py']
```

`*.py`で、すべての.pyファイルを取得できるんだ！便利だよね( ơ ᴗ ơ )

---

## 10.3. コマンドライン引数

### sysモジュール - sys.argv

一般的なユーティリティスクリプトは、**コマンドライン引数を処理**する必要があることがよくあります。

これらの引数は、`sys`モジュールの`argv`属性に**リストとして保存**されます。

**実例：**

コマンドラインで`python demo.py one two three`を実行すると：

```python
>>> import sys
>>> print(sys.argv)
['demo.py', 'one', 'two', 'three']
```

最初の要素がスクリプト名で、その後が引数になるよ！

---

### argparseモジュール - より高度な引数処理

`argparse`モジュールは、コマンドライン引数を処理するための**より洗練されたメカニズム**を提供します。

以下のスクリプトは、1つ以上のファイル名と、表示する行数のオプションを抽出します：

```python
import argparse

parser = argparse.ArgumentParser(
    prog='top',
    description='Show top lines from each file')
parser.add_argument('filenames', nargs='+')
parser.add_argument('-l', '--lines', type=int, default=10)
args = parser.parse_args()
print(args)
```

**実行例：**

コマンドラインで`python top.py --lines=5 alpha.txt beta.txt`を実行すると：
- `args.lines`が`5`に設定されます
- `args.filenames`が`['alpha.txt', 'beta.txt']`に設定されます

---

## 10.4. エラー出力のリダイレクトとプログラムの終了

### 標準入出力とエラー出力

`sys`モジュールには、**stdin、stdout、stderr**の属性もあります。

`stderr`は、**標準出力がリダイレクトされている場合でも**、警告やエラーメッセージを表示するのに役立ちます：

```python
>>> sys.stderr.write('Warning, log file not found starting a new one\n')
Warning, log file not found starting a new one
```

### プログラムの終了

スクリプトを終了する最も直接的な方法は、`sys.exit()`を使用することです。

---

## 10.5. 文字列パターンマッチング

### reモジュール - 正規表現

`re`モジュールは、高度な文字列処理のための**正規表現ツール**を提供します。

複雑なマッチングと操作には、正規表現が**簡潔で最適化されたソリューション**を提供します：

```python
>>> import re
>>> re.findall(r'\bf[a-z]*', 'which foot or hand fell fastest')
['foot', 'fell', 'fastest']
>>> re.sub(r'(\b[a-z]+) \1', r'\1', 'cat in the the hat')
'cat in the hat'
```

`findall()`は「f」で始まる単語を全部見つけて、`sub()`は重複した単語を削除してるよ！

### シンプルな場合は文字列メソッドを使う

**簡単な機能だけが必要な場合は、文字列メソッドが好まれます**。読みやすく、デバッグしやすいからです：

```python
>>> 'tea for too'.replace('too', 'two')
'tea for two'
```

---

## 10.6. 数学

### mathモジュール - 浮動小数点数学

`math`モジュールは、浮動小数点数学のための**基礎となるCライブラリ関数**へのアクセスを提供します：

```python
>>> import math
>>> math.cos(math.pi / 4)
0.70710678118654757
>>> math.log(1024, 2)
10.0
```

---

### randomモジュール - ランダム選択

`random`モジュールは、**ランダム選択を行うツール**を提供します：

```python
>>> import random
>>> random.choice(['apple', 'pear', 'banana'])
'apple'
>>> random.sample(range(100), 10)   # 重複なしサンプリング
[30, 83, 16, 4, 8, 81, 41, 50, 18, 33]
>>> random.random()    # ランダムなfloat
0.17970987693706186
>>> random.randrange(6)    # range(6)から選ばれたランダムな整数
4
```

---

### statisticsモジュール - 統計計算

`statistics`モジュールは、数値データの**基本的な統計プロパティ**（平均、中央値、分散など）を計算します：

```python
>>> import statistics
>>> data = [2.75, 1.75, 1.25, 0.25, 0.5, 1.25, 3.5]
>>> statistics.mean(data)
1.6071428571428572
>>> statistics.median(data)
1.25
>>> statistics.variance(data)
1.3720238095238095
```

### より高度な数値計算

SciPyプロジェクト（https://scipy.org）には、数値計算のための他の多くのモジュールがあります。

---

## 10.7. インターネットアクセス

インターネットにアクセスし、インターネットプロトコルを処理するための**多くのモジュール**があります。

最もシンプルな2つは：
- `urllib.request` - URLからデータを取得
- `smtplib` - メールを送信

### urllib.request - URLからデータ取得

```python
>>> from urllib.request import urlopen
>>> with urlopen('http://worldtimeapi.org/api/timezone/etc/UTC.txt') as response:
...     for line in response:
...         line = line.decode()    # バイトをstrに変換
...         if line.startswith('datetime'):
...             print(line.rstrip())    # 末尾の改行を削除
...
datetime: 2022-01-01T01:36:47.689215+00:00
```

### smtplib - メール送信

```python
>>> import smtplib
>>> server = smtplib.SMTP('localhost')
>>> server.sendmail('soothsayer@example.org', 'jcaesar@example.org',
... """To: jcaesar@example.org
... From: soothsayer@example.org
...
... Beware the Ides of March.
... """)
>>> server.quit()
```

**注意：** 2番目の例は、localhostでメールサーバーが実行されている必要があります。

---

## 10.8. 日付と時刻

### datetimeモジュール

`datetime`モジュールは、**シンプルな方法と複雑な方法の両方で日付と時刻を操作する**クラスを提供します。

日付と時刻の演算がサポートされていますが、実装の焦点は、**出力フォーマットと操作のための効率的なメンバー抽出**にあります。

モジュールは、**タイムゾーン対応**のオブジェクトもサポートしています。

**実例：**

```python
>>> # 日付は簡単に構築してフォーマットできる
>>> from datetime import date
>>> now = date.today()
>>> now
datetime.date(2003, 12, 2)
>>> now.strftime("%m-%d-%y. %d %b %Y is a %A on the %d day of %B.")
'12-02-03. 02 Dec 2003 is a Tuesday on the 02 day of December.'

>>> # 日付はカレンダー演算をサポート
>>> birthday = date(1964, 7, 31)
>>> age = now - birthday
>>> age.days
14368
```

日付の差分で年齢を計算できるのめっちゃ便利！( ˶>ᴗ<˶)

---

## 10.9. データ圧縮

一般的なデータアーカイブと圧縮フォーマットは、以下のモジュールによって**直接サポート**されています：
- `zlib`
- `gzip`
- `bz2`
- `lzma`
- `zipfile`
- `tarfile`

**実例：**

```python
>>> import zlib
>>> s = b'witch which has which witches wrist watch'
>>> len(s)
41
>>> t = zlib.compress(s)
>>> len(t)
37
>>> zlib.decompress(t)
b'witch which has which witches wrist watch'
>>> zlib.crc32(s)
226805979
```

41バイトが37バイトに圧縮されたよ！

---

## 10.10. パフォーマンス測定

### timeitモジュール - 実行時間の測定

一部のPythonユーザーは、同じ問題に対する異なるアプローチの**相対的なパフォーマンスを知る**ことに深い関心を持っています。

Pythonは、これらの質問にすぐに答える**測定ツール**を提供します。

**実例：**

例えば、引数をスワップするために、従来のアプローチの代わりに**タプルのパックとアンパック機能**を使用したくなるかもしれません。

`timeit`モジュールは、わずかなパフォーマンス上の利点をすぐに示します：

```python
>>> from timeit import Timer
>>> Timer('t=a; a=b; b=t', 'a=1; b=2').timeit()
0.57535828626024577
>>> Timer('a,b = b,a', 'a=1; b=2').timeit()
0.54962537085770791
```

タプルのアンパックの方がちょっと速いね！

### profileとpstatsモジュール

`timeit`の細かい粒度とは対照的に、`profile`と`pstats`モジュールは、**より大きなコードブロック内の時間的に重要なセクションを特定する**ためのツールを提供します。

---

## 10.11. 品質管理

### 高品質ソフトウェアの開発

高品質ソフトウェアを開発するための1つのアプローチは、**開発中に各関数のテストを書き**、開発プロセス中に頻繁にそれらのテストを実行することです。

---

### doctestモジュール - docstring内のテスト

`doctest`モジュールは、モジュールをスキャンし、プログラムの**docstringに埋め込まれたテストを検証する**ツールを提供します。

テストの構築は、典型的な呼び出しとその結果をdocstringに**カット＆ペースト**するだけで簡単です。

これにより、ユーザーに例を提供することで**ドキュメントが改善**され、doctestモジュールが**コードがドキュメントに忠実であることを確認**できます：

```python
def average(values):
    """Computes the arithmetic mean of a list of numbers.
    
    >>> print(average([20, 30, 70]))
    40.0
    """
    return sum(values) / len(values)

import doctest
doctest.testmod()   # 埋め込まれたテストを自動的に検証
```

---

### unittestモジュール - より包括的なテスト

`unittest`モジュールは、`doctest`モジュールほど簡単ではありませんが、**別ファイルでより包括的なテストセットを維持**できます：

```python
import unittest

class TestStatisticalFunctions(unittest.TestCase):
    
    def test_average(self):
        self.assertEqual(average([20, 30, 70]), 40.0)
        self.assertEqual(round(average([1, 5, 7]), 1), 4.3)
        with self.assertRaises(ZeroDivisionError):
            average([])
        with self.assertRaises(TypeError):
            average(20, 30, 70)

unittest.main()   # コマンドラインから呼び出すとすべてのテストを実行
```

エラーケースもちゃんとテストできるよ！٩(°̀ᗝ°́)و

---

## 10.12. バッテリー同梱

### "Batteries Included"哲学

Pythonには**「バッテリー同梱（batteries included）」**という哲学があります。

これは、より大きなパッケージの**洗練された堅牢な機能**を通じて最もよく見られます。

例えば：

---

### XML-RPC - リモートプロシージャコール

`xmlrpc.client`と`xmlrpc.server`モジュールは、リモートプロシージャコールの実装を**ほぼ些細なタスク**にします。

モジュール名にもかかわらず、**XMLの直接的な知識や処理は不要**です。

---

### email - メール管理

`email`パッケージは、MIMEや他のRFC 2822ベースのメッセージドキュメントを含む、**メールメッセージを管理するためのライブラリ**です。

実際にメッセージを送受信する`smtplib`や`poplib`とは異なり、emailパッケージには以下の完全なツールセットがあります：
- 複雑なメッセージ構造（添付ファイルを含む）の構築または復号化
- インターネットエンコーディングとヘッダープロトコルの実装

---

### JSON - データ交換フォーマット

`json`パッケージは、この人気のある**データ交換フォーマットを解析するための堅牢なサポート**を提供します。

---

### CSV - カンマ区切り値

`csv`モジュールは、**カンマ区切り値フォーマット**でのファイルの直接読み書きをサポートします。これはデータベースやスプレッドシートで一般的にサポートされています。

---

### XML処理

XML処理は、以下のパッケージでサポートされています：
- `xml.etree.ElementTree`
- `xml.dom`
- `xml.sax`

これらのモジュールとパッケージは、**Pythonアプリケーションと他のツール間のデータ交換を大幅に簡素化**します。

---

### SQLite - 軽量データベース

`sqlite3`モジュールは、**SQLiteデータベースライブラリのラッパー**です。

わずかに非標準のSQL構文を使用して、更新およびアクセスできる**永続的なデータベース**を提供します。

---

### 国際化サポート

国際化は、以下を含む多くのモジュールでサポートされています：
- `gettext`
- `locale`
- `codecs`パッケージ

---

## 📝 重要ポイントまとめ

### 1. OS・ファイル操作

| モジュール | 用途                 | 主な関数/メソッド                 |
| ---------- | -------------------- | --------------------------------- |
| `os`       | OS操作               | `getcwd()`, `chdir()`, `system()` |
| `shutil`   | 高レベルファイル操作 | `copyfile()`, `move()`            |
| `glob`     | ワイルドカード検索   | `glob()`                          |

### 2. コマンドライン・システム

| モジュール | 用途               | 重要ポイント                                         |
| ---------- | ------------------ | ---------------------------------------------------- |
| `sys`      | システムパラメータ | `argv`でコマンドライン引数取得、`stderr`でエラー出力 |
| `argparse` | 引数解析           | より高度なコマンドライン引数処理                     |

### 3. 文字列・パターン

| モジュール     | 用途       | いつ使う？               |
| -------------- | ---------- | ------------------------ |
| `re`           | 正規表現   | 複雑なパターンマッチング |
| 文字列メソッド | 単純な置換 | シンプルな操作のみ       |

### 4. 数学・統計

| モジュール   | 提供する機能           |
| ------------ | ---------------------- |
| `math`       | 三角関数、対数など     |
| `random`     | ランダム選択、乱数生成 |
| `statistics` | 平均、中央値、分散など |

### 5. インターネット・通信

| モジュール       | 用途              |
| ---------------- | ----------------- |
| `urllib.request` | URLからデータ取得 |
| `smtplib`        | メール送信        |
| `poplib`         | メール受信        |

### 6. 日付・時刻

- `datetime`: 日付・時刻操作、フォーマット、演算

### 7. データ圧縮

- `zlib`, `gzip`, `bz2`, `lzma`, `zipfile`, `tarfile`

### 8. パフォーマンス・テスト

| モジュール | 用途                   |
| ---------- | ---------------------- |
| `timeit`   | コードの実行時間測定   |
| `doctest`  | docstring内のテスト    |
| `unittest` | 本格的なユニットテスト |

### 9. データフォーマット

| モジュール | 用途               |
| ---------- | ------------------ |
| `json`     | JSON処理           |
| `csv`      | CSV処理            |
| `xml.*`    | XML処理            |
| `sqlite3`  | SQLiteデータベース |

### 試験対策で特に重要

1. **import os vs from os import ***: 後者は避ける（シャドーイングの問題）
2. **sys.argv**: コマンドライン引数のリスト（最初はスクリプト名）
3. **正規表現vs文字列メソッド**: シンプルな場合は文字列メソッド推奨
4. **doctest**: docstring内にテストを書ける
5. **"Batteries Included"**: Pythonは標準ライブラリが充実
6. **タイムゾーン対応**: datetimeモジュールがサポート
7. **dir()とhelp()**: モジュール探索に便利

### よく使うパターン

```python
# ファイルコピー
shutil.copyfile('source.txt', 'dest.txt')

# ワイルドカード検索
glob.glob('*.py')

# コマンドライン引数
sys.argv[1]  # 最初の引数

# 現在日時
from datetime import date
date.today()

# JSON読み込み
import json
data = json.loads(json_string)
```

---

**次の章**: [11. Python標準ライブラリ入門 Part2](tutorial_011.md)

これで標準ライブラリPart1も完璧だね！Part2と合わせて覚えれば、試験対策バッチリだよ( ˶'ᵕ'˶)♡