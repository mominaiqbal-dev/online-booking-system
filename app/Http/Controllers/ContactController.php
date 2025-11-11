<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReceived;

class ContactController extends Controller
{
    /**
     * Store a new contact message, send notification email and persist to DB.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        // persist
        $contact = Contact::create($data);

        // send email to configured receiver (fall back to app.mail_from)
        try {
            $to = config('mail.from.address') ?? env('MAIL_TO_ADDRESS');
            if ($to) {
                Mail::to($to)->send(new ContactReceived($contact));
            }
        } catch (\Exception $e) {
            // swallow mail errors but continue (log if needed)
            logger()->error('Contact email send failed: '.$e->getMessage());
        }

        return redirect()->back()->with('success', 'Thank you! Your message has been sent.');
    }
}
