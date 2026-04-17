<h1 align="center">UML Transcoder</h1>

<p align="center">
AI-powered UML ↔ Code transcoding with a visual editor and custom format support
</p>

---

## 🧠 Overview

UML Transcoder is a full-stack tool for converting between UML diagrams and code across multiple languages.  
It supports both file-based and text-based inputs, using AI to generate structured representations and enabling seamless transitions between visual design and implementation.

---

## ✨ Core Features

- 🔁 **UML → Code** (via structured JSON representation)  
- 🔁 **Code → UML** (from files or raw text input)  
- 🖼 **UML Image → Code** using uploaded diagrams  
- 📄 **Multi-language support** (not limited to SQL DDL)  
- 💾 **Custom `.RohanUML` format** for export/import  
- 🎯 Visual editor with dynamic node sizing  
- 🔗 Support for multiple UML relationship types  

---

## 🔄 Supported Flows

### UML Image → Code
Upload a UML diagram → stored via backend → processed through AI → converted into code.

### Code → UML
Upload a code file or paste text → extracted and sent to AI → converted into UML diagram.

### No File Mode
Paste raw input directly → sent to generation pipeline without file handling.

---

## 🏗 Architecture

**Frontend**
- Diagram editor with dynamic resizing nodes
- Import/export support via `.RohanUML`
- UI for defining relationships between entities

**Backend**
- Upload controller for handling files and generating accessible URLs
- AI-powered generation pipeline (via prompt-based routing)
- Conversion pipeline:
  - Input → JSON representation → Output (code or UML)

---

## 🔗 UML Relationships Supported

- Inheritance  
- Realization / Implementation  
- Composition  
- Aggregation  
- Association  
- Dependency  

Supports multi-entity relationships (not limited to pairwise connections).

---

## 📦 Project Structure

```bash
/frontend      # UI, diagram editor, import/export
/backend       # API, uploads controller, generation logic
```
