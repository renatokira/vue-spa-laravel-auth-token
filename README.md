# Vue 3 SPA Authentication Token Laravel Scaffolding

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Clone the frontend project

```bash
git clone https://github.com/renatokira/vue-spa-laravel-authentication-token.git
```

```bash
cd vue-spa-laravel-authentication-token
```

## Configuration env

If you want to set the Base API URL, do the following:

Make a copy of the `.env.example` file and rename it to `.env`.

```bash
cp .env.example .env
```

Open the .env file and add the `VITE_API_BASE_URL` environment variable followed by the URL of your API, for example:

```text
VITE_API_BASE_URL=http://localhost:8001
```

## Install dependencies and run

```bash
npm install
```

```bash
npm run dev
```

## Screenshots

![image](https://user-images.githubusercontent.com/10859156/219979247-f1620eb8-a8c2-4049-aec3-547ad7b63412.png)
![image](https://user-images.githubusercontent.com/10859156/219478559-a880a7a7-6c1b-4fd7-8ab0-44da7c2fea94.png)
![image](https://user-images.githubusercontent.com/10859156/219979219-96a645a8-2219-454d-8c54-897ced15dec9.png)

## Laravel Project

### If not exist create laravel project

```bash
composer create-project laravel/laravel example-app
```

```bash
cd example-app
```

### Database configuration in .env file

#### Ex Mysql

```text
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

#### Or Sqlite

```bash
touch database/database.sqlite
```

```text
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

## Laravel Sanctum

Laravel Sanctum provides a featherweight authentication system for SPAs and simple APIs.
([Laravel Sanctum Git](https://github.com/laravel/sanctum)).
Documentation for Sanctum can be found on the [Laravel website](https://laravel.com/docs/sanctum).

### [CORS and Cookies](https://laravel.com/docs/10.x/sanctum#cors-and-cookies)

If you are having trouble authenticating with your application from a SPA that executes on a separate subdomain, you have likely misconfigured your CORS (Cross-Origin Resource Sharing) or session cookie settings.

You should ensure that your application's CORS configuration is returning the Access-Control-Allow-Credentials header with a value of True. This may be accomplished by setting the supports_credentials option within your application's config/cors.php configuration file to true.

In addition, you should enable the withCredentials option on your application's global axios instance.

```php
# arquivo config/cors.php
'supports_credentials' => true,
```

### CORS Configuration

To allow access from other origins (such as your frontend application) to your Laravel API, it is necessary to configure CORS correctly. To do this, you can use the config/cors.php file.

For example, to allow only requests originated from the URL defined in the FRONTEND_URL environment variable, add the following configuration to the config/cors.php file:

```bash
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
```

With this, only requests originated from the URL defined in FRONTEND_URL will be allowed by CORS.

You can set 'allowed_origins' => ['*'] to allow all origins, which can be useful in some cases. However, it's important to remember that allowing all origins can increase the risk of CSRF (Cross-Site Request Forgery) attacks and other types of malicious attacks. Therefore, it's recommended that you restrict the allowed origins whenever possible, for example, by allowing only your frontend's URL.

In this example, you should set your frontend URL in the .env file. If your frontend is running at <http://localhost:5173>, the content of the .env file would be:

```text

FRONTEND_URL=http://localhost:5173

```

This ensures that if you need to change the URL of your frontend, you can easily do so without having to modify the code of your Laravel application.

## Create a Controller for authentication

```bash
php artisan make:controller Auth/AuthenticatedTokenController
```

The Controller should look like this:

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticatedTokenController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $token = $user->createToken('app-token-api')->plainTextToken;

        return response()->json(['token' => $token], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json(['message' => 'Logout successfully.'], 200);
    }
}
```

## Configure Routes

Command to create an auth directory inside the routes directory and create a file called api.php inside the auth directory:

```bash
mkdir -p routes/auth && touch routes/auth/api.php
```

Then open the routes/auth/api.php file and add the following code to handle the authentication:

```php
<?php

use App\Http\Controllers\Auth\AuthenticatedTokenController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthenticatedTokenController::class, 'login']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthenticatedTokenController::class, 'logout']);
});
```

Include in the final routes/api.php file:

```php
require __DIR__ . '/auth/api.php';
```

List all routes registered in your Laravel app, including the routes you just added for authentication:

 ```bash
php artisan route:list
```

### Migrate to database

```bash
php artisan migrate
```

### Create test user to login frontend application

```bash
php artisan tinker
```

```bash
\App\Models\User::factory()->create([ 'name' => 'Test User', 'email' => 'test@example.com']);
```

### Add in api routes(routes/api.php) to be used in frontend application laravel project

```php
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/user/edit', function (Request $request) {
    $request->validate([
        'name' => 'required|min:2|max:255',
    ]);

    try {
        $user = $request->user();
        $user->name = $request->get('name');
        $user->save();
        return response()->json(['status' => 'Successful!']);
    } catch (\Throwable) {
        throw \Illuminate\Validation\ValidationException::withMessages([
            'name' => ['unexpected error'],
        ]);
    }
})->middleware(['auth:sanctum']);

```

### Run project

```bash
php artisan serve

```
