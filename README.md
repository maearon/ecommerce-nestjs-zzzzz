
### UML
https://mermaidchart.com/play?utm_source=mermaid_live_editor&utm_medium=share#pako:eNqdVctu00AU_ZXRVKWp5ITUjzwsVKlNUugikCbpBoKqiT1OLBxPGI_ThqoLVmwQFPgANogdK36MT-DaM3acNq2gXrS5M-ece33vmfEldphLsY0nnMynaNgehQieKB7LhRHuhC46jSgfYbmVPK3Ap6F4NcJ_vn_5oSL0WMFeSxwN3VF4S-05ZEMHNnpKBD0nS_QIveAu5VFRXe2l8h-v0UHvOFvKxZNHElPUt58qQgPKF75D14DtwzOFLRXBsD7Cu_dWe8jZm_U373dP0ozXH1CfjMe-6J6gJ2O-X-rSKCITiiRl91_acGijHmcOEP1wklW-1onjcAGdZVz24vOv1cLGF-2R5Qy2ZU--_s7jjeA-NJS7EvvpfRbe1UBILLu3VkSxgwoIOSVwlX8TDNJJWCH1HfPY3kZHATtHzEOdC-rEwmdqRxmvXIaO7lXQs-GwB2JvYxoJVGpxCqaRo4ZxAGo_t1FYsJmk6xXU77UQW4Avhq1eOlNUUmLlPo3mLIxopqM8G65sKFUGZEFRmwiicLnzbkONCurMfIE6SS_RDku2zpy0ZndHpT_yOS2T0C0fMT6hIssOHpR68i-EUtIkFdSmgZ-8Qyqr8Pm8buLHm_GZbW7Cnc1wNb5iSSuHpEzlcjjsp3M3GcqqorxPsCS5uWk3U9X2itjL5pnZaDMvqzLnwULBYQOxDOAUqoMKAc394flBYG85LjU9T4tEcr7trRpp6N5YheVz3xVTW59fFPlq2g-lJ32XXM-rGWY95xqGcYuoOSxgPIF6RY3VHDIlz3KcXMmrEtek91aRT-OhAtlU_oePNTyjfEZ8Fz5Ml4naCIspncGtZMNPl_A3yS15BTgSCzZYhg62BY-phjmLJ1NseySIIIrT2bd9AvfuLF-lrg896crvXvr50-DzlyRTGnD5UN5icSiwbdQ0PCfhS8Zm2T6E2L7EF9jWm_VKs27opmXWa1a1YWh4iW2zUalZetOqVmt7hlnT6-aVht-lAtVKo2kZRrXasODfnqk3r_4CJMJm1g

## RUN

1. Install packages

~ npm i
2. Open 2 tabs

~ ./local/nodeA/run.sh -> Tab1
~ ./local/nodeB/run.sh -> Tab2

## TEST

```
POST {{baseUrl}}/orders
Content-Type: {{contentType}}

{
  "customerId": "user-001",
  "items": [
    { "sku": "SKU-123", "qty": 2, "price": 150000 },
    { "sku": "SKU-456", "qty": 1, "price": 95000 }
  ]
}
```