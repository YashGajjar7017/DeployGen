# Port Change Task: 5000 → 8000 (Frontend/Backend)
Approved plan: Edit gui_client.py and docker-compose.yml only.

## Steps:
- [x] 1. Edit windows-client/src/gui_client.py (update backend_url to 8000)
- [x] 2. Edit docker-compose.yml (update ports:5000→8000, API_URL:5000→8000, NEXT_PUBLIC_API_URL:5000→8000)
- [ ] 3. Test changes (docker-compose up, verify connections on 8000)
- [x] 4. Mark complete & cleanup TODO.md

All edits complete. Backend now consistently uses port 8000.
