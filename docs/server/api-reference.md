# API Reference

## Users

### Insert or update user

<table data-header-hidden><thead><tr><th width="145">Items</th><th>Detail</th></tr></thead><tbody><tr><td>Path</td><td>/users/create</td></tr><tr><td>Method</td><td>POST</td></tr><tr><td>Headers</td><td><pre class="language-json"><code class="lang-json">{
    "Authorization": "Bearer ...",
    "Content-Type": "application/json"
}
</code></pre></td></tr><tr><td>Body</td><td><pre class="language-json"><code class="lang-json">{
    "id": 5,
    "first_name": "James",
    "last_name": "Martin",
    "username": "james",
    "is_bot": false,
    "language_code": "en",
    "is_premium": false,
    "added_to_attachment_menu": false,
    "allows_write_to_pm": false,
    "photo_url": null
}
</code></pre></td></tr><tr><td>Result code</td><td><mark style="color:green;">201 Success</mark> | <mark style="color:red;">500 Error</mark></td></tr><tr><td>Result body</td><td><pre class="language-json"><code class="lang-json"><strong>{
</strong>    "message": "result",
}
</code></pre></td></tr></tbody></table>

## Categories

### Get list of categories

<table data-header-hidden><thead><tr><th width="145">Items</th><th>Detail</th></tr></thead><tbody><tr><td>Path</td><td>/categories</td></tr><tr><td>Method</td><td>GET</td></tr><tr><td>Headers</td><td><pre class="language-json"><code class="lang-json">{
    "Authorization": "Bearer ..."
}
</code></pre></td></tr><tr><td>Result code</td><td><mark style="color:green;">200 Success</mark> | <mark style="color:red;">500 Error</mark></td></tr><tr><td>Success body</td><td><pre class="language-json"><code class="lang-json">[
    {
        "id": 1,
        "name": "Animals",
        "created_at": "2023-09-27T05:40:33.870Z",
        "updated_at": "2023-09-27T05:40:33.870Z"
    },
    ...
]
</code></pre></td></tr><tr><td>Error body</td><td><pre class="language-json"><code class="lang-json"><strong>{
</strong>    "message": "error",
}
</code></pre></td></tr></tbody></table>

## Games

### Get game

Get game info by id

<table data-header-hidden><thead><tr><th width="145">Items</th><th>Detail</th></tr></thead><tbody><tr><td>Path</td><td>/games/:id</td></tr><tr><td>Method</td><td>GET</td></tr><tr><td>Headers</td><td><pre class="language-json"><code class="lang-json">{
    "Authorization": "Bearer ..."
}
</code></pre></td></tr><tr><td>Result code</td><td><mark style="color:green;">200 Success</mark> | 404 Not found | <mark style="color:red;">500 Error</mark></td></tr><tr><td>Success body</td><td><pre class="language-json"><code class="lang-json">{
    "id": 15,
    "owner_id": 5,
    "category_id": 11,
    "status": 0,
    "user_first_name": "James", // Game creator info
    "user_last_name": "Martin",
    "category_name": "Sports"
}
</code></pre></td></tr><tr><td>Error body</td><td><pre class="language-json"><code class="lang-json"><strong>{
</strong>    "message": "error",
}
</code></pre></td></tr></tbody></table>

### Create new game

Create using user id and category id

<table data-header-hidden><thead><tr><th width="145">Items</th><th>Detail</th></tr></thead><tbody><tr><td>Path</td><td>/games/create</td></tr><tr><td>Method</td><td>POST</td></tr><tr><td>Headers</td><td><pre class="language-json"><code class="lang-json">{
    "Authorization": "Bearer ...",
    "Content-Type": "application/json",
}
</code></pre></td></tr><tr><td>Body</td><td><pre class="language-json"><code class="lang-json"><strong>{
</strong>    "userId": 5,
    "categoryId": 1
}
</code></pre></td></tr><tr><td>Result code</td><td><mark style="color:green;">201 Created</mark> |  409 Already exists | <mark style="color:red;">500 Error</mark></td></tr><tr><td>Response body</td><td><pre class="language-json"><code class="lang-json"><strong>{
</strong>    "message": "result",
}
</code></pre></td></tr></tbody></table>

