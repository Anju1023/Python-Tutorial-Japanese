<!-- claude_translate/tutorial_011.md -->

# Python標準ライブラリ入門 Part2 - 詳しい解説版

このPart2では、プロフェッショナルなプログラミングに必要な、より高度なモジュールについて学びます。これらのモジュールは小規模なスクリプトではあまり使われませんが、実務では重要です。

---

## 11.1. 出力のフォーマット

### reprlibモジュール - 大きなデータを省略して表示

`reprlib`モジュールは、`repr()`関数のカスタマイズ版を提供します。大きなデータや深くネストされたコンテナ（リストの中にリストがあるような構造）を、**省略形で表示**してくれます。

**実例:**
```python
>>> import reprlib
>>> reprlib.repr(set('supercalifragilisticexpialidocious'))
"{'a', 'c', 'd', 'e', 'f', 'g', ...}"
```

普通に`repr()`を使うと全部の文字が表示されますが、`reprlib.repr()`を使うと途中が「...」で省略されて見やすくなります。デバッグ時に大量のデータを見やすく表示したいときに便利です。

---

### pprintモジュール - きれいに整形して表示

`pprint`（pretty printの略）モジュールは、組み込みオブジェクトやユーザー定義オブジェクトを、**インタープリタが読みやすい形で**印刷する高度な機能を提供します。

結果が1行より長い場合、「プリティプリンター」が改行とインデントを追加して、データ構造をより明確に表示します。

**実例:**
```python
>>> import pprint
>>> t = [[[['black', 'cyan'], 'white', ['green', 'red']], 
...      [['magenta', 'yellow'], 'blue']]]
>>> pprint.pprint(t, width=30)
[[[['black', 'cyan'],
   'white',
   ['green', 'red']],
  [['magenta', 'yellow'],
   'blue']]]
```

`width=30`で最大幅を30文字に指定すると、それに合わせて自動的に改行してインデントしてくれます。複雑なデータ構造を確認するときに超便利です！

---

### textwrapモジュール - テキストを指定幅に折り返し

`textwrap`モジュールは、テキストの段落を**指定した画面幅に合わせて**フォーマットします。

**実例:**
```python
>>> import textwrap
>>> doc = """The wrap() method is just like fill() except that it returns
... a list of strings instead of one big string with newlines to separate
... the wrapped lines."""
>>> print(textwrap.fill(doc, width=40))
The wrap() method is just like fill()
except that it returns a list of strings
instead of one big string with newlines
to separate the wrapped lines.
```

長い文章を、40文字幅で自動的に折り返してくれます。ヘルプメッセージやドキュメントを整形するときに役立ちます。

---

### localeモジュール - 地域固有のデータフォーマット

`locale`モジュールは、**文化圏固有のデータフォーマット**のデータベースにアクセスします。

localeのformat関数のgrouping属性を使うと、数値を**グループ区切り記号付き**（3桁ごとのカンマなど）で簡単にフォーマットできます。

**実例:**
```python
>>> import locale
>>> locale.setlocale(locale.LC_ALL, 'English_United States.1252')
'English_United States.1252'
>>> conv = locale.localeconv()  # 規約のマッピングを取得
>>> x = 1234567.8
>>> locale.format("%d", x, grouping=True)
'1,234,567'
>>> locale.format_string("%s%.*f", (conv['currency_symbol'],
...                      conv['frac_digits'], x), grouping=True)
'$1,234,567.80'
```

アメリカ英語のロケールに設定すると、数値が「1,234,567」のようにカンマ区切りで表示され、通貨記号も自動的に「$」になります。国際化対応のアプリに必須です。

---

## 11.2. テンプレート機能

### stringモジュールのTemplateクラス

`string`モジュールには、**エンドユーザーが編集しやすい簡略化された構文**を持つ`Template`クラスがあります。これにより、ユーザーはアプリケーションを変更することなく、カスタマイズできます。

**プレースホルダーの書き方:**
- `$`と有効なPython識別子（英数字とアンダースコア）でプレースホルダーを作ります
- `${変数名}`のように波括弧で囲むと、その後にスペースなしで英数字を続けられます
- `$$`と書くと、エスケープされた単一の`$`になります

**実例:**
```python
>>> from string import Template
>>> t = Template('${village}folk send $$10 to $cause.')
>>> t.substitute(village='Nottingham', cause='the ditch fund')
'Nottinghamfolk send $10 to the ditch fund.'
```

---

### substitute() vs safe_substitute()

**substitute()メソッド:**
- プレースホルダーが辞書やキーワード引数で提供されていない場合、`KeyError`を発生させます

**safe_substitute()メソッド:**
- メールマージ形式のアプリケーションに適しています
- ユーザー提供のデータが不完全な場合でも、**プレースホルダーをそのまま残します**

**実例:**
```python
>>> t = Template('Return the $item to $owner.')
>>> d = dict(item='unladen swallow')
>>> t.substitute(d)
Traceback (most recent call last):
...
KeyError: 'owner'
>>> t.safe_substitute(d)
'Return the unladen swallow to $owner.'
```

---

### カスタムデリミタの指定

Templateのサブクラスでカスタムデリミタを指定できます。例えば、写真ブラウザの一括リネームユーティリティでは、現在の日付、画像シーケンス番号、ファイル形式などのプレースホルダーに**パーセント記号**を使用することができます。

**実例:**
```python
>>> import time, os.path
>>> photofiles = ['img_1074.jpg', 'img_1076.jpg', 'img_1077.jpg']
>>> class BatchRename(Template):
...     delimiter = '%'
>>> fmt = input('Enter rename style (%d-date %n-seqnum %f-format): ')
Enter rename style (%d-date %n-seqnum %f-format): Ashley_%n%f
>>> t = BatchRename(fmt)
>>> date = time.strftime('%d%b%y')
>>> for i, filename in enumerate(photofiles):
...     base, ext = os.path.splitext(filename)
...     newname = t.substitute(d=date, n=i, f=ext)
...     print('{0} --> {1}'.format(filename, newname))
img_1074.jpg --> Ashley_0.jpg
img_1076.jpg --> Ashley_1.jpg
img_1077.jpg --> Ashley_2.jpg
```

テンプレート機能のもう一つの用途は、**プログラムロジックと複数の出力フォーマットの詳細を分離すること**です。これにより、XMLファイル、プレーンテキストレポート、HTMLウェブレポート用のカスタムテンプレートを置き換えることができます。

---

## 11.3. バイナリデータレコードレイアウトの操作

### structモジュール - バイナリデータの変換

`struct`モジュールは、**可変長バイナリレコードフォーマット**を扱うための`pack()`と`unpack()`関数を提供します。

以下の例は、`zipfile`モジュールを使わずに、ZIPファイルのヘッダー情報をループで処理する方法を示しています。

**パックコード:**
- `"H"`: 2バイトの符号なし整数
- `"I"`: 4バイトの符号なし整数
- `"<"`: 標準サイズでリトルエンディアンのバイト順を示します

**実例:**
```python
import struct

with open('myfile.zip', 'rb') as f:
    data = f.read()

start = 0
for i in range(3):  # 最初の3つのファイルヘッダーを表示
    start += 14
    fields = struct.unpack('<IIIHH', data[start:start+16])
    crc32, comp_size, uncomp_size, filenamesize, extra_size = fields
    
    start += 16
    filename = data[start:start+filenamesize]
    start += filenamesize
    extra = data[start:start+extra_size]
    print(filename, hex(crc32), comp_size, uncomp_size)
    
    start += extra_size + comp_size  # 次のヘッダーにスキップ
```

バイナリデータを扱うときに、`struct`を使えば簡単にPythonのデータ型に変換できます。

---

## 11.4. マルチスレッド処理

### スレッドとは？

**スレッド処理**は、順次依存していないタスクを切り離す技術です。スレッドを使うと、バックグラウンドで他のタスクが実行されている間に、ユーザー入力を受け付けるアプリケーションの応答性を向上させることができます。

関連する使用例として、別のスレッドで計算と並行してI/O処理を実行することもできます。

**実例:**
```python
import threading, zipfile

class AsyncZip(threading.Thread):
    def __init__(self, infile, outfile):
        threading.Thread.__init__(self)
        self.infile = infile
        self.outfile = outfile
    
    def run(self):
        f = zipfile.ZipFile(self.outfile, 'w', zipfile.ZIP_DEFLATED)
        f.write(self.infile)
        f.close()
        print('Finished background zip of:', self.infile)

background = AsyncZip('mydata.txt', 'myarchive.zip')
background.start()
print('The main program continues to run in foreground.')

background.join()  # バックグラウンドタスクの終了を待つ
print('Main program waited until background was done.')
```

---

### スレッド間の調整

マルチスレッドアプリケーションの主な課題は、**データや他のリソースを共有するスレッドを調整すること**です。

そのために、threadingモジュールは以下の同期プリミティブを提供します：
- ロック（locks）
- イベント（events）
- 条件変数（condition variables）
- セマフォ（semaphores）

これらのツールは強力ですが、小さな設計エラーが再現困難な問題を引き起こす可能性があります。

**推奨されるアプローチ:**
- リソースへのすべてのアクセスを**単一のスレッドに集中**させる
- `queue`モジュールを使って、他のスレッドからそのスレッドにリクエストを送る
- スレッド間通信と調整に`Queue`オブジェクトを使用するアプリケーションは、設計が簡単で、読みやすく、信頼性が高くなります

---

## 11.5. ログ記録

### loggingモジュール - ログシステム

`logging`モジュールは、**フル機能で柔軟なログシステム**を提供します。

最もシンプルな使い方では、ログメッセージをファイルまたは`sys.stderr`に送信します。

**実例:**
```python
import logging

logging.debug('Debugging information')
logging.info('Informational message')
logging.warning('Warning:config file %s not found', 'server.conf')
logging.error('Error occurred')
logging.critical('Critical error -- shutting down')
```

**出力結果:**
```
WARNING:root:Warning:config file server.conf not found
ERROR:root:Error occurred
CRITICAL:root:Critical error -- shutting down
```

---

### ログレベル

デフォルトでは、情報（info）とデバッグ（debug）メッセージは**抑制**され、出力は標準エラーに送信されます。

**ログレベル（優先度順）:**
1. `DEBUG` - デバッグ情報
2. `INFO` - 情報メッセージ
3. `WARNING` - 警告
4. `ERROR` - エラー
5. `CRITICAL` - 重大なエラー

その他の出力オプションには、メール、データグラム、ソケット、HTTPサーバー経由でのメッセージルーティングがあります。

新しいフィルターを使って、メッセージの優先度に基づいて異なるルーティングを選択できます。

ログシステムは、Pythonから直接設定することも、アプリケーションを変更せずにカスタマイズされたログ記録のために**ユーザー編集可能な設定ファイル**から読み込むこともできます。

---

## 11.6. 弱参照

### メモリ管理と弱参照

Pythonは**自動メモリ管理**を行います（ほとんどのオブジェクトで参照カウント、循環参照の除去にはガベージコレクション）。メモリは、最後の参照が削除された直後に解放されます。

このアプローチはほとんどのアプリケーションでうまく機能しますが、時には**他の何かが使用している間だけオブジェクトを追跡したい**場合があります。

残念ながら、追跡するだけでも参照が作成され、それがオブジェクトを永続化してしまいます。

---

### weakrefモジュール

`weakref`モジュールは、**参照を作成せずにオブジェクトを追跡する**ツールを提供します。

オブジェクトが不要になると、weakrefテーブルから自動的に削除され、weakrefオブジェクトのコールバックがトリガーされます。

**典型的な用途:**
作成コストの高いオブジェクトのキャッシング

**実例:**
```python
>>> import weakref, gc
>>> class A:
...     def __init__(self, value):
...         self.value = value
...     def __repr__(self):
...         return str(self.value)
...
>>> a = A(10)                      # 参照を作成
>>> d = weakref.WeakValueDictionary()
>>> d['primary'] = a               # 参照を作成しない
>>> d['primary']                   # オブジェクトがまだ生きていればフェッチ
10
>>> del a                          # 唯一の参照を削除
>>> gc.collect()                   # ガベージコレクションをすぐに実行
0
>>> d['primary']                   # エントリは自動的に削除された
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
    d['primary']
  File "C:/python39/lib/weakref.py", line 46, in __getitem__
    o = self.data[key]()
KeyError: 'primary'
```

変数`a`を削除すると、オブジェクトへの唯一の強参照がなくなり、ガベージコレクション後に弱参照辞書からも自動的に削除されます。

---

## 11.7. リストを操作するツール

### 組み込みlist型の代替実装

多くのデータ構造のニーズは、組み込みのlist型で満たせます。しかし、時には**異なるパフォーマンストレードオフ**を持つ代替実装が必要になることもあります。

---

### arrayモジュール - コンパクトな配列

`array`モジュールは、**同種のデータのみを保存し、よりコンパクトに保存する**、リストのような`array()`オブジェクトを提供します。

以下の例は、2バイトの符号なしバイナリ数（タイプコード`"H"`）として保存された数値の配列を示しています。通常のPython int オブジェクトのリストでは、エントリごとに16バイト必要です。

**実例:**
```python
>>> from array import array
>>> a = array('H', [4000, 10, 700, 22222])
>>> sum(a)
26932
>>> a[1:3]
array('H', [10, 700])
```

メモリ効率が重要な場合に便利です。

---

### collectionsモジュール - deque（デック）

`collections`モジュールは、`deque()`オブジェクトを提供します。これは、**左側からの追加と取り出しが高速**ですが、中央での検索は遅いリストのようなものです。

これらのオブジェクトは、**キューや幅優先木探索**の実装に適しています。

**実例:**
```python
>>> from collections import deque
>>> d = deque(["task1", "task2", "task3"])
>>> d.append("task4")
>>> print("Handling", d.popleft())
Handling task1

unsearched = deque([starting_node])
def breadth_first_search(unsearched):
    node = unsearched.popleft()
    for m in gen_moves(node):
        if is_goal(m):
            return m
        unsearched.append(m)
```

`popleft()`は左端（最初）の要素を取り出し、`append()`は右端（最後）に追加します。キューやスタックの実装に最適です。

---

### bisectモジュール - ソート済みリストの操作

代替リスト実装に加えて、ライブラリには他のツールも用意されています。

`bisect`モジュールは、**ソート済みリストを操作する**ための関数を提供します。

**実例:**
```python
>>> import bisect
>>> scores = [(100, 'perl'), (200, 'tcl'), (400, 'lua'), (500, 'python')]
>>> bisect.insort(scores, (300, 'ruby'))
>>> scores
[(100, 'perl'), (200, 'tcl'), (300, 'ruby'), (400, 'lua'), (500, 'python')]
```

`insort()`は、リストをソートされた状態に保ちながら要素を挿入します。

---

### heapqモジュール - ヒープ（優先度キュー）

`heapq`モジュールは、通常のリストに基づいて**ヒープを実装する**ための関数を提供します。

最小値のエントリは常に位置ゼロに保持されます。これは、最小要素に繰り返しアクセスするが、完全なリストソートを実行したくないアプリケーションに役立ちます。

**実例:**
```python
>>> from heapq import heapify, heappop, heappush
>>> data = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
>>> heapify(data)                    # リストをヒープ順に再配置
>>> heappush(data, -5)               # 新しいエントリを追加
>>> [heappop(data) for i in range(3)]  # 最小の3つのエントリをフェッチ
[-5, 0, 1]
```

優先度キューの実装に便利です。常に最小値が先頭にあるので、効率よく取り出せます。

---

## 11.8. 10進浮動小数点演算

### decimalモジュール - 正確な10進数計算

`decimal`モジュールは、10進浮動小数点演算のための`Decimal`データ型を提供します。

組み込みの`float`の2進浮動小数点実装と比較して、`Decimal`クラスは特に以下の場合に役立ちます：

- **金融アプリケーション**や正確な10進表現が必要な他の用途
- **精度の制御**
- 法的または規制要件を満たすための**丸め制御**
- **有効桁数の追跡**
- ユーザーが手計算と一致する結果を期待するアプリケーション

---

### 浮動小数点の問題

例えば、70セントの電話料金に5%の税金を計算すると、10進浮動小数点と2進浮動小数点で異なる結果が得られます。結果を最も近いセントに丸めると、差が顕著になります。

**実例:**
```python
>>> from decimal import *
>>> round(Decimal('0.70') * Decimal('1.05'), 2)
Decimal('0.74')
>>> round(.70 * 1.05, 2)
0.73
```

`Decimal`の結果は末尾のゼロを保持し、2桁の有効数字を持つ被乗数から4桁の有効数字を自動的に推測します。Decimalは手計算のように数学を再現し、2進浮動小数点が10進数量を正確に表現できないときに発生する問題を回避します。

---

### Decimalの利点

正確な表現により、`Decimal`クラスは、2進浮動小数点には不向きな**剰余計算や等価性テスト**を実行できます。

**実例:**
```python
>>> Decimal('1.00') % Decimal('.10')
Decimal('0.00')
>>> 1.00 % 0.10
0.09999999999999995

>>> sum([Decimal('0.1')]*10) == Decimal('1.0')
True
>>> sum([0.1]*10) == 1.0
False
```

`decimal`モジュールは、**必要なだけの精度**で演算を提供します。

**実例:**
```python
>>> getcontext().prec = 36
>>> Decimal(1) / Decimal(7)
Decimal('0.142857142857142857142857142857142857')
```

精度を36桁に設定すると、36桁まで正確に計算できます。金融計算や科学計算で必須です！

---

## 📝 重要ポイントまとめ

### 1. 出力フォーマット系モジュール
- **reprlib**: 大きなデータを省略して表示（デバッグに便利）
- **pprint**: データ構造を見やすく整形表示
- **textwrap**: テキストを指定幅で折り返し
- **locale**: 地域ごとの数値・通貨フォーマット

### 2. テンプレート（string.Template）
- `$変数名`または`${変数名}`でプレースホルダー作成
- `substitute()`: データがないとKeyError
- `safe_substitute()`: データがなくてもエラーにならない（プレースホルダーを残す）
- カスタムデリミタを設定可能

### 3. バイナリデータ（struct）
- `pack()`: Pythonデータ → バイナリ
- `unpack()`: バイナリ → Pythonデータ
- フォーマット文字列で型を指定（H=2バイト符号なし整数、I=4バイト符号なし整数など）

### 4. マルチスレッド（threading）
- バックグラウンドでタスクを実行してアプリの応答性を向上
- スレッド間の調整には`queue.Queue`を使うのが推奨
- 同期プリミティブ：ロック、イベント、条件変数、セマフォ

### 5. ログ記録（logging）
- ログレベル：DEBUG < INFO < WARNING < ERROR < CRITICAL
- デフォルトではWARNING以上のみ表示
- 設定ファイルでカスタマイズ可能

### 6. 弱参照（weakref）
- 参照を作らずにオブジェクトを追跡
- オブジェクトが不要になると自動削除
- キャッシュの実装に便利

### 7. リスト操作ツール
- **array**: 同じ型のデータをコンパクトに保存
- **deque**: 両端での追加・削除が高速（キュー向き）
- **bisect**: ソート済みリストへの効率的な挿入
- **heapq**: ヒープ（優先度キュー）の実装

### 8. 10進数演算（decimal）
- 金融計算に必須！浮動小数点の誤差を回避
- 精度を自由に設定可能
- 手計算と同じ結果が得られる

### 試験対策で特に重要な箇所
1. **Template**の`substitute()`と`safe_substitute()`の違い
2. **threading**でのスレッド間通信には`queue.Queue`が推奨
3. **logging**のレベルの順序（DEBUG→INFO→WARNING→ERROR→CRITICAL）
4. **decimal**が浮動小数点より正確な理由
5. **deque**は両端操作が高速、**heapq**は最小値取得が高速

これで試験勉強バッチリだよ！頑張ってね(  ˶'ᵕ'˶)♡