# 🛡️ KYC GUARD

A KYC (Know Your Customer) identity verification demo implemented twice:

1. **Java console application** — `KYCVERIFICATION.java` (Scanner-based terminal flow with custom checked exceptions)
2. **Web application** — an HTML/CSS/JS port of the exact same verification rules, hosted on GitHub Pages

## 🔗 Live demo

**https://dhanush-004.github.io/KYC-GUARD/**

## ✅ Verification rules

| Field   | Rule                                                                  |
| ------- | --------------------------------------------------------------------- |
| Name    | letters and spaces only                                               |
| DOB     | valid `YYYY-MM-DD`, cannot be in the future                           |
| Aadhaar | exactly 12 digits (spaces/dashes allowed, e.g. `1234 5678 9012`)      |
| PAN     | 10 chars: 5 letters + 4 digits + 1 letter (e.g. `ABCDE1234F`)         |
| Age     | must be 18+, computed from DOB (`Parent/guardian required` otherwise) |

On success the applicant's name is upper-cased and the Aadhaar number is masked
(`XXXX-XXXX-1234`).

## 🖥️ Run the Java console version

```bash
javac KYCVERIFICATION.java
java KYCVERIFICATION
```

Requires JDK 8 or later (uses `java.time`).

## 📁 Project structure

```
KYCVERIFICATION.java   Java console application (original assignment code)
index.html             Web UI (GitHub Pages entry point)
style.css              Styling
app.js                 Verification logic (port of the Java rules)
```
