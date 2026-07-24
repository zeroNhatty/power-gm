<script setup lang="ts">
import { z } from "zod"

definePageMeta({
  layout: 'operational-logged-in',
  middleware: ['sanctum:auth'],
});

const TicketSchema = z.object({
  id: z.number().int(),
  status: z.string(),
  node_id: z.number().int(),
  assignee_id: z.number().int(),
})

type Ticket = z.infer<typeof TicketSchema>

const { data: tickets, error, status, refresh } = await useAsyncData<Ticket[]>('tickets', async () => {
  const rawData = await $fetch('/api/tickets', {
    baseURL: 'http://localhost:8000'
  })
  return z.array(TicketSchema).parse(rawData)
});
</script>

<template>
  <div class="card w-96 bg-base-100 card-md shadow-sm">
    <div class="card-body">
      <h2 class="card-title">Ticket List</h2>
      
      <div v-if="status === 'pending'">Loading tickets...</div>
      <div v-else-if="error" class="text-error">
        Error loading tickets: {{ error.message }}
      </div>
      
      <div v-else class="space-y-2">
        <div v-for="ticket in tickets" :key="ticket.id" class="border-b pb-2">
            <div v-if="ticket.status == 'solved'">
                 <div class="badge badge-success">
                    <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle><polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline></g></svg>
                    Solved
                </div>
            </div>
            <div v-else-if="ticket.status == 'assigned'">
                 <div class="badge badge-warning">
                    <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><g fill="currentColor"><path d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><line x1="9" y1="6.5" x2="9" y2="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><path d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z" fill="currentColor" data-stroke="none" stroke="none"></path></g></svg>
                    Being Maintained
                </div>
            </div>
            <div v-else>
                 <div class="badge badge-error">
                    <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor"><rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" stroke-width="0"></rect><path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" stroke-width="0" fill="currentColor"></path></g></svg>
                    pending
                </div>
            </div>
          <p><strong>ID:</strong> {{ ticket.id }}</p>
          <p><strong>Status:</strong> {{ ticket.status }}</p>
          <p><strong>Node ID:</strong> {{ ticket.node_id }}</p>
          <p><strong>Assignee ID:</strong> {{ ticket.assignee_id }}</p>
        </div>
      </div>

      <div class="justify-end card-actions mt-4">
        <button class="btn btn-primary" @click="refresh()">Refresh</button>
      </div>
    </div>
  </div>
</template>