<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>New Contact Message</title>
  </head>
  <body>
    <h2>New contact message received</h2>
    <p><strong>Name:</strong> {{ $contact->name }}</p>
    <p><strong>Email:</strong> {{ $contact->email }}</p>
    <p><strong>Subject:</strong> {{ $contact->subject ?? '-' }}</p>
    <p><strong>Message:</strong></p>
    <p>{{ nl2br(e($contact->message)) }}</p>
    <p>Received at: {{ $contact->created_at }}</p>
  </body>
</html>
