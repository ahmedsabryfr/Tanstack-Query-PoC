# From Pinia to TanStack Query

It makes fetching, caching, synchronizing and updating server state in your web applications a breeze.

Manage async states in a **declarative** way, not imperative, just like the Vue.js states vs plain JS.

---

## High-Level View

How much code gets simpler when moving products and orders from Pinia stores to Vue Query composables.

### 1. What Actually Gets Deleted

Moving a module from Pinia to TanStack Query isn't an addition — it's a subtraction. The code you remove is the noise that was never solving a real problem:

- **Loading flags** — `isLoading`, `isFetching`, `isError`, `error` declared and reset manually in every action.
- **Manual cache sync** — `splice`, `findIndex`, `push` to mirror what the server already knows.
- **Boilerplate guards** — repeated `try/catch/finally` wrapped around every single API call.

What remains is code that actually describes intent: *what data you need*, *how to fetch it*, and *what to do when a mutation succeeds*. The result is fewer lines, but more importantly — lines that are easier to read, reason about, and change.

---

## 2. Sample Comparisons

### Query Example

**Pinia (inside a store action):**

```js
// inside a Pinia action
async getProducts() {
  this.isLoading = true
  this.isError = false
  this.error = null
  try {
    const response = await ProductsApi.getAll()
    this.products = response.data
  } catch (e) {
    this.isError = true
    this.error = e.message
  } finally {
    this.isLoading = false
  }
}
```

**Vue Query composable:**

```js
function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => ProductsApi.getAll(),
  })
}
```

When used in a component:

```js
const { data, isFetching, isError, error, reset } = useProductsQuery()
```

### Action Example

**Pinia Action (Store):**

```js
async deleteProduct(id) {
  this.isDeleting = true
  this.error = null

  try {
    // 1. Perform the API call
    await ProductsApi.delete(id)

    // 2. MANUALLY sync local state (The dangerous part)
    // If you forget this, the UI is stale.
    // If you get the index wrong, the UI is broken.
    const index = this.products.findIndex(product => product.id === id)
    if (index !== -1) {
      this.products.splice(index, 1)
    }
  } catch (err) {
    this.error = err.message
  } finally {
    this.isDeleting = false
  }
}
```

**Vue Query Composable:**

```js
const queryClient = useQueryClient()

const { mutate, data, isLoading, isError, error } = useMutation({
  mutationFn: (id) => ProductsApi.delete(id),
  onSuccess: () => {
    // 1. Invalidating triggers an auto-refetch of the list
    // The UI updates automatically when the new data arrives.
    queryClient.invalidateQueries({ queryKey: ['products'] })
    // + ability to implement optimistic updates
  },
})
```

---

## 3. Why Server State Is Different

Traditional state management libraries are great for working with **client state**, but they are not so great at working with **async or server state**.

Server state:

- Is persisted remotely in a location you may not control or own
- Requires asynchronous APIs for fetching and updating
- Implies shared ownership and can be changed by other people without your knowledge
- Can potentially become "out of date" in your applications if you're not careful

### Challenges Vue Query Solves

- **Caching** (possibly the hardest thing to do in programming)
- Deduping multiple requests for the same data into a single request
- Updating "out of date" data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state (data not used for more than 5m is removed from memory)
- Memoizing query results with structural sharing

> TanStack Query is hands down one of the best libraries for managing server state. It works amazingly well out-of-the-box, with zero-config, and can be customized to your liking as your application grows.

---

## 4. Server State: Store-Based vs Query-Based

| Feature            | Pinia (Manual Fetching)                                                      | TanStack Query                                                                    |
| ------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Source of Truth     | Store tries to mirror server data; you manually keep it in sync.             | Server is the source of truth; Query acts as a managed cache around server data.  |
| Freshness          | No built-in concept of freshness; data stays as-is until you refetch.        | Explicit `staleTime` + configurable refetching (on focus, on mount, intervals...). |
| Deduping           | No built-in deduping; you add guards (e.g. `if (!data) fetch...`).          | Automatic: same query key across components results in a single shared fetch.     |
| Garbage Collection | Manual cleanup (resetting store / clearing references when needed).          | Automatic cache GC based on `cacheTime` and query usage.                          |

TanStack Query will likely:

- Help you **remove many lines** of complicated and misunderstood code from your application and replace with just a handful of lines of TanStack Query logic.
- Make your application **more maintainable** and easier to build new features without worrying about wiring up new server state data sources.
- Have a **direct impact on your end-users** by making your application feel faster and more responsive than ever before.
- Potentially help you **save on bandwidth** and increase memory performance.

---

## 5. Architecture & Responsibilities

### Pinia (Synchronous / Client-Only)

Keep using Pinia for things that exist only in the browser session:

- **UI State:** Sidebar open/close, active modal, current theme.
- **Session State:** User authentication tokens (usually), permissions that don't change often.
- **Form State:** Complex multi-step form data before it is submitted to the server.

### TanStack Query (Asynchronous / Server)

- **Entities:** Products, Orders.
- **Derived Data:** Filtering lists (TanStack `select` option is powerful here).

> **How do they work together in practice?**
> Pinia handles pure local state. TanStack Query handles async states.

---

## 6. Developer Experience: Supercharged Debugging

One of the biggest pain points in apps is debugging async race conditions.

- *"Did that data update finish?"*
- *"Is this data cached or fresh?"*

Typically, these questions get answered by adding `console.log` or hopping between the Network Tab and Vue DevTools.

TanStack Query includes **dedicated DevTools** that visualize the invisible. You get a real-time dashboard of your server state without writing any extra code.

### Key Capabilities

- **Visual Cache Status:** Instantly see if queries are Fresh, Fetching, Stale, or Inactive. No more guessing if the data is up-to-date.
- **Data Explorer:** Inspect the exact JSON response stored in the cache without digging through the Network tab.
- **Manual Triggers:** You can button-click to Refetch, Invalidate, or Reset a query.
  - *Scenario:* Want to test what happens if the "Menu List" updates while a staff member is typing? Just click "Refetch" in the DevTools while interacting with the UI.
- **Network Throttling Simulation:** Test how the app behaves on slow connections directly from the tool.
- **Zero-Config Setup:** It is plug-and-play. Just add the component to your root `App.vue` and it only appears in development mode.

---

## 7. Migration Strategy: Evolution, Not Revolution

The best part about moving to TanStack Query is that it is **not an all-or-nothing rewrite**. It creates a hybrid architecture where Pinia and TanStack Query coexist perfectly.

### Recommended Roadmap

| Phase | Name                    | Description                                                                                                                                                                                              |
| ----- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | **Coexistence**         | Install TanStack Query alongside Pinia.                                                                                                                                                                  |
| 2     | **Pilot**               | Migrate a single, isolated module to prove the pattern in production.                                                                                                                                    |
| 3     | **New Features Default** | Stop the bleeding. All new features requiring data fetching get implemented declaratively using TanStack Query composables from day one. No more imperative async/await logic inside Pinia stores for new server state. |
| 4     | **Incremental Refactor** | As old modules get touched for maintenance or bug fixes, refactor them to the new standard.                                                                                                              |

---

## 8. Conclusion & Next Steps

Adopting TanStack Query shifts the development paradigm from **imperatively managing data fetching bugs** to **declaratively describing data requirements**.

For any data-heavy Vue application, this means:

- **For Users:** A snappier interface that doesn't show stale data.
- **For Devs:** ~35% less code to write and maintain per feature.
- **For Business:** Faster feature delivery and fewer regression bugs.

> **Recommendation:** A low-risk starting point is migrating a single isolated module — whichever one your team touches most often — as a pilot to validate these benefits before expanding further.
