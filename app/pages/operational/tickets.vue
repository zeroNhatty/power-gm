<script setup lang="ts">
import { z } from "zod"

definePageMeta({
  layout: 'operational-logged-in',
  middleware: ['sanctum:auth'],
});

const url = 'http://localhost:8000' 

const NodeSchema = z.object({
  id: z.number().int(),
  location: z.string(),
  status: z.string(),
})

const UserSchema = z.object({
  id: z.number().int(),
  firstname: z.string().nullable().optional(),
  middle_name: z.string().nullable().optional(),
  lastname: z.string().nullable().optional(),
})

const TicketSchema = z.object({
  id: z.number().int(),
  status: z.string(),
  node_id: z.number().int(),
  assignee_id: z.number().int().nullable(),
  node: NodeSchema.optional().nullable(),
  assignee: UserSchema.optional().nullable(),
})

type Ticket = z.infer<typeof TicketSchema>

const { data: tickets, error, status, refresh } = await useAsyncData<Ticket[]>('tickets', async () => {
  const rawData = await $fetch('/api/tickets', { baseURL: url })
  return z.array(TicketSchema).parse(rawData)
})
</script>

<template>
  <div class="card w-full max-w-xl bg-base-100 shadow-sm border border-base-200">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title text-xl">Operational Tickets</h2>
        <button class="btn btn--success" @click="refresh()">Refresh</button>
      </div>

      <div v-if="status === 'pending'" class="flex justify-center p-8">
        <span class="loading loading-spinner loading-md"></span>
      </div>

      <div v-else-if="error" class="alert alert-error">
        <span>Error loading tickets: {{ error.message }}</span>
      </div>

      <div v-else class="space-y-4">
        <div v-for="ticket in tickets" :key="ticket.id" class="p-4 bg-base-200/50 rounded-lg space-y-2">
          
          <!-- Status Badges -->
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm">Ticket #{{ ticket.id }}</span>

            <div v-if="ticket.status === 'solved'" class="badge badge-success gap-1 text-white">
              <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="7 13 10 16 17 8"/></svg>
              Solved
            </div>

            <div v-else-if="ticket.status === 'assigned'" class="badge badge-warning gap-1">
              <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z"/><line x1="9" y1="6.5" x2="9" y2="10"/><path d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z" fill="currentColor"/></svg>
              Being Maintained
            </div>

            <div v-else class="badge badge-error gap-1 text-white">
              <svg class="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)"/><path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z"/></svg>
              Pending
            </div>
          </div>

          <div class="text-sm space-y-1">
            <p><strong>Node Location:</strong> {{ ticket.node?.location ?? `Node #${ticket.node_id}` }}</p>
            <p>
              <strong>Assignee:</strong> 
              <span v-if="ticket.assignee">
                {{ ticket.assignee.firstname }} {{ ticket.assignee.lastname }}
              </span>
              <span v-else class="text-base-content/60 italic">Unassigned</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>