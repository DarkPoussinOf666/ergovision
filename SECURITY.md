# Security & Privacy Policy

## 🔒 Zero-Data Privacy Architecture

**ErgoVision AI** is fundamentally engineered with a **Zero-Knowledge / Zero-Telemetry Architecture**:

1. **Client-Side Execution**: All video frame processing, landmark estimations (Google MediaPipe Pose), and mathematical computations execute strictly inside your local browser via WebAssembly (Wasm) and WebGL.
2. **No External Streaming**: The webcam stream is NEVER sent to any remote server, cloud API, or third-party service.
3. **Local Storage Only**: User preferences, pacing thresholds, and daily activity logs remain strictly stored within the browser's `localStorage` on your local machine.

---

## 🛡️ Reporting a Vulnerability

If you discover a security vulnerability or privacy concern in this project, please report it responsibly:

- **Do NOT open a public issue.**
- Instead, please contact the maintainers via a private GitHub Security Advisory or direct message.
- Provide a detailed explanation, including proof of concept or steps to reproduce.

We will review reports promptly and publish patches in a timely manner.
