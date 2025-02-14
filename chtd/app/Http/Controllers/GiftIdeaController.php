<?php

namespace App\Http\Controllers;

use App\Models\GiftIdea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class GiftIdeaController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = GiftIdea::with(['user', 'recipientUser'])
            ->where('user_id', Auth::id());

        // Jeśli podano user_id, filtruj pomysły dla konkretnego użytkownika
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $giftIdeas = $query->latest()->get();

        return response()->json($giftIdeas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'image_url' => 'nullable|url|max:255',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'recipient_type' => ['required', Rule::in(['CUSTOM', 'USER'])],
            'recipient_user_id' => [
                Rule::requiredIf(fn () => $request->recipient_type === 'USER'),
                'nullable',
                'exists:users,id'
            ],
            'recipient_custom' => [
                Rule::requiredIf(fn () => $request->recipient_type === 'CUSTOM'),
                'nullable',
                'string',
                'max:255'
            ],
        ]);

        $giftIdea = Auth::user()->giftIdeas()->create($validated);
        $giftIdea->load(['user', 'recipientUser']);

        return response()->json($giftIdea, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(GiftIdea $giftIdea)
    {
        $this->authorize('view', $giftIdea);
        
        $giftIdea->load(['user', 'recipientUser']);
        return response()->json($giftIdea);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GiftIdea $giftIdea)
    {
        $this->authorize('update', $giftIdea);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|max:255',
            'image_url' => 'nullable|url|max:255',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'recipient_type' => ['sometimes', 'required', Rule::in(['CUSTOM', 'USER'])],
            'recipient_user_id' => [
                Rule::requiredIf(fn () => $request->recipient_type === 'USER'),
                'nullable',
                'exists:users,id'
            ],
            'recipient_custom' => [
                Rule::requiredIf(fn () => $request->recipient_type === 'CUSTOM'),
                'nullable',
                'string',
                'max:255'
            ],
        ]);

        $giftIdea->update($validated);
        $giftIdea->load(['user', 'recipientUser']);

        return response()->json($giftIdea);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GiftIdea $giftIdea)
    {
        $this->authorize('delete', $giftIdea);
        
        $giftIdea->delete();
        return response()->noContent();
    }
}
