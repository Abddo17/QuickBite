<?php

namespace App\Http\Controllers\API;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use ErrorException;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StripeController extends Controller
{


    /**
     * Créer un paiement via Stripe
     *
     * Crée un PaymentIntent Stripe pour traiter un paiement en USD. Retourne le client_secret pour confirmer le paiement côté client.
     *
     * @group Gestion des Paiements
     * @bodyParam amount integer required Le montant du paiement en cents (USD). Example: 149999
     * @response 200 {
     *   "clientSecret": "pi_3N5X9Z2eZvKYlo2I0A_secret_XYZ123"
     * }
     * @response 400 {
     *   "error": "Invalid amount provided"
     * }
     */


    public function PayByStripe(Request $request)
    {   // setting the api key from stripe 
        Stripe::setApiKey(env('STRIPE_SECRET'));
        try {
            // creating paymentIntent 
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => 'usd',
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (ErrorException $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
}
