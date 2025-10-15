# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - heading "Login" [level=1] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e8]:
        - generic "Email" [ref=e10]: "* Email"
        - textbox "* Email" [ref=e14]:
          - /placeholder: Email
      - generic [ref=e16]:
        - generic "Password" [ref=e18]: "* Password"
        - generic [ref=e22]:
          - textbox "* Password" [ref=e23]:
            - /placeholder: Password
          - img "eye-invisible" [ref=e25] [cursor=pointer]:
            - img [ref=e26]
      - generic [ref=e34]:
        - button "Login" [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: Login
        - button "Đăng ký" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: Đăng ký
  - button "Open Next.js Dev Tools" [ref=e46] [cursor=pointer]:
    - img [ref=e47]
  - alert [ref=e50]
```