# Copilot Instructions for React Router v7 + React v19 + Vite Project

## 🚀 プロジェクト構成
- **React Router v7** (App Router) - ファイルベースルーティング
- **React v19** - 最新の並行機能とServer Components対応
- **Vite** - 高速ビルドツール
- **TypeScript v5** - 型安全性
- **Tailwind CSS v4** - モダンCSS
- **pnpm** - パッケージマネージャー

## 📁 ファイル構造とルーティング

### React Router v7 ファイルベースルーティング
- `app/routes/` ディレクトリにルートファイルを配置
- ルートファイルは関数エクスポートでコンポーネントを定義
- `app/routes.ts` でルート設定を管理
- 動的ルート: `app/routes/users.$userId.tsx`
- レイアウト: `app/routes/_layout.tsx`
- ネストしたルート: `app/routes/dashboard.tsx` + `app/routes/dashboard.settings.tsx`

```typescript
// app/routes/example.tsx
import type { Route } from "./+types/example";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Example Page" },
    { name: "description", content: "Example description" }
  ];
}

export function loader({}: Route.LoaderArgs) {
  // データローディングロジック
  return { data: "example" };
}

// 関数宣言を使用（const よりも推奨）
export default function ExamplePage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-4">
      <h1>Example Page</h1>
    </div>
  );
}
```

## ⚛️ React v19 ベストプラクティス

### コンポーネント定義
```typescript
// ✅ 推奨: 関数宣言
export default function MyComponent({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

// ❌ 非推奨: const宣言
// const MyComponent = ({ title }: { title: string }) => <h1>{title}</h1>;
```

### React 19の新機能活用
```typescript
// use() フックでPromiseを直接処理
import { use, Suspense } from "react";

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // React 19の新機能
  return <div>{user.name}</div>;
}

// Server Actions (React Router v7では loader/action 関数で代替)
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  // フォーム処理ロジック
  return redirect("/success");
}
```

### 並行機能とTransitions
```typescript
import { useTransition, useState } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // 検索の状態更新を非緊急として扱う
  function handleSearch(value: string) {
    startTransition(() => {
      setQuery(value);
    });
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <div>検索中...</div>}
    </div>
  );
}
```

## 🎨 Tailwind CSS v4 ベストプラクティス

### 新しい@import構文
```css
/* app/app.css */
@import "tailwindcss";

/* カスタムスタイル */
@layer utilities {
  .scroll-smooth-fast {
    scroll-behavior: smooth;
    scroll-padding-top: 2rem;
  }
}
```

### コンポーネントでの使用
```typescript
// レスポンシブデザインとアクセシビリティを重視
function Button({ children, variant = "primary" }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

## 🔧 TypeScript v5 活用

### 型定義
```typescript
// 厳密な型定義
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ユーティリティ型の活用
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
```

### React Router v7の型
```typescript
// app/routes/users.$userId.tsx
import type { Route } from "./+types/users.$userId";

export function loader({ params }: Route.LoaderArgs) {
  // params.userId は自動的に型推論される
  return getUserById(params.userId);
}

export default function UserDetail({ loaderData, params }: Route.ComponentProps) {
  // loaderData と params の型は自動推論
  return <div>{loaderData.name}</div>;
}
```

## ⚡ Viteベストプラクティス

### 環境変数
```typescript
// 環境変数の型定義
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 使用例
const apiUrl = import.meta.env.VITE_API_URL;
```

### 動的インポート
```typescript
// コード分割とlazy loading
import { lazy, Suspense } from "react";

const DashboardPage = lazy(() => import("./routes/dashboard"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  );
}
```

## 🎯 パフォーマンス最適化

### メモ化
```typescript
import { memo, useMemo, useCallback } from "react";

// React.memo でコンポーネントをメモ化
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // 重い計算をメモ化
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  // コールバック関数をメモ化
  const handleClick = useCallback((id: string) => {
    // クリック処理
  }, []);

  return <div>{processedData}</div>;
});
```

### React Router v7でのデータ取得最適化
```typescript
// loader で並列データ取得
export async function loader({ params }: Route.LoaderArgs) {
  // 並列でデータを取得
  const [user, posts] = await Promise.all([
    getUserById(params.userId),
    getPostsByUserId(params.userId)
  ]);

  return { user, posts };
}
```

## ♿ アクセシビリティ

### セマンティックHTML
```typescript
function Navigation() {
  return (
    <nav role="navigation" aria-label="メインナビゲーション">
      <ul className="flex space-x-4">
        <li>
          <Link
            to="/home"
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2"
            aria-current="page" // 現在のページの場合
          >
            ホーム
          </Link>
        </li>
      </ul>
    </nav>
  );
}
```

### フォームアクセシビリティ
```typescript
function ContactForm() {
  return (
    <form>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          メールアドレス *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-describedby="email-error"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div id="email-error" className="text-red-600 text-sm mt-1" role="alert">
          {/* エラーメッセージ */}
        </div>
      </div>
    </form>
  );
}
```

## 🧪 テストベストプラクティス

### コンポーネントテスト
```typescript
// React Testing Library推奨
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Button from "./Button";

test("ボタンがクリック可能である", async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>クリック</Button>);
  
  const button = screen.getByRole("button", { name: "クリック" });
  await user.click(button);
  
  expect(handleClick).toHaveBeenCalledOnce();
});
```

## 📦 パッケージ管理

### pnpm使用
```bash
# パッケージ追加
pnpm add package-name

# 開発依存関係
pnpm add -D package-name

# 全体更新
pnpm update
```

## 🔒 セキュリティ

### XSS対策
```typescript
// React は自動でエスケープするが、dangerouslySetInnerHTML は避ける
function SafeComponent({ userInput }: { userInput: string }) {
  return <div>{userInput}</div>; // 自動エスケープ
}

// HTMLが必要な場合はサニタイズライブラリを使用
import DOMPurify from "dompurify";

function UnsafeComponent({ htmlContent }: { htmlContent: string }) {
  const cleanHTML = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
}
```

## 📋 コーディング規約

### 命名規則
- **変数・関数**: camelCase (`userName`, `handleSubmit`)
- **コンポーネント・クラス**: PascalCase (`UserProfile`, `ApiClient`)
- **定数**: UPPER_SNAKE_CASE (`API_ENDPOINT`, `MAX_RETRIES`)
- **ファイル名**: kebab-case またはPascalCase (`user-profile.tsx`, `UserProfile.tsx`)

### コメント
```typescript
/**
 * ユーザー情報を取得する関数
 * @param userId - ユーザーID
 * @returns ユーザー情報のPromise
 */
async function fetchUser(userId: string): Promise<User> {
  // APIからユーザー情報を取得
  const response = await fetch(`/api/users/${userId}`);
  
  if (!response.ok) {
    // エラーハンドリング
    throw new Error(`ユーザー取得に失敗: ${response.status}`);
  }
  
  return response.json();
}
```

## 🚀 デプロイメント

### 本番ビルド最適化
```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  build: {
    // チャンク分割でパフォーマンス向上
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router"],
        },
      },
    },
  },
});
```

これらのベストプラクティスに従うことで、保守性が高く、パフォーマンスに優れた現代的なReactアプリケーションを構築できます。
