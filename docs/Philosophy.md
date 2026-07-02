# Contents
- [Technicians Portal](#technician-portal)

## Technician Portal
<details>
<summary><strong>Access Method to Portal</strong></summary>

- up to this commit [4001b10](https://github.com/zeroNhatty/power-gm/commit/4001b10e819259fe6251caf16cdfbaba842db6ff) a Login button is at the Landing Page which is public. 
- Since the public shouldn't see or access internal infra the solution I thought of to isolate the technician portal is to use a hidden dedicated route called `/operations`  
</details>

<details>
<summary id="technician-tools-summary"><strong>Technicians Tools</strong></summary>

- On the initial design there were no decisions on what kind of tools the technicians will have but the general idea for those tools will be
  - Tracking incoming node signals and isolation of nodes
  - Node status overrides (maintenance, flagging node as faulty ...)
  - Realtime ticket system where technicians are assigned tickets so it can be handled accordingly
</details>

<details>
<summary><strong>Identity and Role Management</strong></summary>

- Inorder to have more control and make it easier to manage technicians we will disable access to the public as mentioned in [Technicians Tools](#technician-tools-summary)
- So to make managing of accounts easier we will add the Manager role which will have privileges like managing, activating and deactivating of accounts.
- Like the technicians the mangers will use the `/operational` route to access there page (Note: Pages the managers and technicians use will be different)
</details>

<small>This was written on July 2 / 2026</small>

