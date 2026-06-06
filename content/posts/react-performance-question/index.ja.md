---
title: Reactのパフォーマンス改善を体験できる練習問題を作ってみた
date: 2022-12-13
description: 業務でReactのパフォーマンス改善をする機会があったので問題を一般化して練習問題を作ってみました
tags: ['フロントエンド', 'React', 'パフォーマンス']
---

この記事は[YAMAP エンジニア アドベントカレンダー2022](https://qiita.com/advent-calendar/2022/yamap-engineers) 14日目の記事です。

業務でReactで実装されたフォームのパフォーマンス改善をしたので、その時の問題を一般化してパフォーマンス改善を体験できる練習問題を作ってみました。

## 練習問題
Reactで`<input>`要素がリストで表示されており、`<input>`要素にテキストを入力してみると非常にレスポンスが遅い状態になっています。このレスポンス速度を改善するのが今回の問題です。

<iframe src="https://stackblitz.com/edit/react-ts-evcw6y?embed=1&file=src/App.tsx" style="width: 100%; height: 400px"></iframe>

ソースコードを眺めてみるとApp.tsxでTodoの一覧を管理しており`TotoList`コンポーネントを描画しています。
`onChange`propsには`setTodos`を渡しておりTodoの一覧を更新します。

```tsx
// App.tsx
const initialTodos: TodoModel[] = [...Array(100)].map((_, i) => ({
  id: i,
  text: 'aaa',
}));

const App = () => {
  const [todos, setTodos] = useState(initialTodos);

  return (
    <div>
      <button
        onClick={() => {
          alert(todos[0].text);
        }}
      >
        保存
      </button>
      <TodoList todos={todos} onChange={setTodos} />
    </div>
  );
};
```

次に`TodoList`コンポーネントの実装を見てみます。

`TodoList`では`<input>`要素として`Todo`コンポーネントを描画しており、変更があったときに新しい`Todo`のオブジェクトを受け取り新しいTodoリストを引数としてpropsで渡された`onChange`コールバック関数を実行して、親要素に新しいTodoリストを渡しています。

```tsx
export const TodoList: FC<TodoListProps> = ({ todos, onChange }) => {
  const handleChange = useCallback(
    (updatedTodo: TodoModel) => {
      const index = todos.findIndex((todo) => todo.id === updatedTodo.id);
      onChange?.([
        ...todos.slice(0, index),
        updatedTodo,
        ...todos.slice(index + 1),
      ]);
    },
    [onChange, todos]
  );

  return (
    <ul>
      {todos.map((todo) => {
        return (
          <li key={todo.id}>
            <Todo todo={todo} onChange={handleChange} />
          </li>
        );
      })}
    </ul>
  );
};
```

最後に`Todo`コンポーネントの実装を見てみます。

`Todo`コンポーネントではpropsで受け取った`todo`のテキストの内容を`<input>`要素のvalueとして表示しています。テキストが変更された時に新しいテキストでTodoオブジェクトを作成して`onChange`関数を実行して親要素に新しいTodoオブジェクトを渡しています。

`[...Array()]`はコンポーネントの描画速度を疑似的に遅くするために仕込んでいます。は問題を作成するための疑似コードなので、ここを削除しないでください。

```tsx
export const Todo: FC<TodoProps> = memo(({ todo, onChange }) => {
  [...Array(100000)].forEach(() => 1 + 1);

  return (
    <input
      type="text"
      defaultValue={todo.text}
      onChange={(evt) => {
        onChange({
          ...todo,
          text: evt.target.value,
        });
      }}
    />
  );
});
```

このコンポーネント単体の描画速度は約10msほどになっており、実際の実装でも再現し得る問題になっています。

![プロファイルの結果](profile.png)

## 解説
問題の解答は別の記事で書こうと思います。
興味があれば解いてみてください。
