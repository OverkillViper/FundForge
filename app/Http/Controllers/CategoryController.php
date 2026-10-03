<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{

    public function index(Request $request)
    {
        $categories = auth()->user()
            ->categories()
            ->withCount('transactions')
            ->withSum([
                'transactions as total_expense' => fn ($query) =>
                    $query->where('type', 'expense'),
            ], 'amount')
            ->orderBy('name')
            ->get();

        return Inertia::render('Transactions/Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'icon' => [
                'required',
                'string',
                'max:100',
            ]
        ]);

        Category::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'icon' => $validated['icon'],
        ]);

        return back()
            ->with('success', 'Category created successfully.');
    }

    public function update(
        Request $request,
        Category $category
    ): RedirectResponse {
        $this->authorizeCategory($category);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'icon' => [
                'required',
                'string',
                'max:100',
            ]
        ]);

        $category->update([
            'name' => $validated['name'],
            'icon' => $validated['icon'],
        ]);

        return back()
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(
        Category $category
    ): RedirectResponse {
        $this->authorizeCategory($category);

        // Transactions will retain their history.
        // Their category_id will become NULL because
        // of nullOnDelete() in the migration.
        $category->delete();

        return back()
            ->with('success', 'Category deleted successfully.');
    }

    private function authorizeCategory(Category $category): void
    {
        abort_unless(
            $category->user_id == auth()->id(),
            403
        );
    }
}