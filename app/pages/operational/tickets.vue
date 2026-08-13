<script setup lang="ts">
import { z } from "zod";

const { $echo } = useNuxtApp();

definePageMeta({
    layout: "operational-logged-in",
    middleware: ["sanctum:auth"],
});

const url = "http://localhost:8000";

const NodeSchema = z.object({
    id: z.number().int(),
    location: z.string(),
    status: z.string(),
});

const UserSchema = z.object({
    id: z.number().int(),
    firstname: z.string().nullable().optional(),
    middle_name: z.string().nullable().optional(),
    lastname: z.string().nullable().optional(),
});

const TicketSchema = z.object({
    id: z.number().int(),
    status: z.string(),
    node_id: z.number().int(),
    assignee_id: z.number().int().nullable(),
    node: NodeSchema.optional().nullable(),
    assignee: UserSchema.optional().nullable(),
});

export type Ticket = z.infer<typeof TicketSchema>;

const {
    data: tickets,
    error,
    status,
    refresh,
} = await useAsyncData<Ticket[]>("tickets", async () => {
    const rawData = await $fetch("/api/tickets", { baseURL: url });
    return z.array(TicketSchema).parse(rawData);
});

// State for selected ticket and modal element
const selectedTicket = ref<Ticket | null>(null);
const modalRef = ref<HTMLDialogElement | null>(null);

function openModal(ticket: Ticket) {
    selectedTicket.value = ticket;
    nextTick(() => {
        modalRef.value?.showModal();
    });
}

/**
 * Handles inserting or updating a ticket in local state from WS events.
 */
function handleTicketUpsert(rawTicket: unknown) {
    if (!tickets.value) {
        tickets.value = [];
    }

    try {
        const ticketData = TicketSchema.parse(rawTicket);
        const index = tickets.value.findIndex((t) => t.id === ticketData.id);

        if (index !== -1) {
            // Update existing item reactively with splice
            const updatedTicket = { ...tickets.value[index], ...ticketData };
            tickets.value.splice(index, 1, updatedTicket);

            // Synchronize active modal if this ticket is open
            if (selectedTicket.value?.id === ticketData.id) {
                selectedTicket.value = updatedTicket;
            }
        } else {
            // add newly created ticket
            tickets.value.unshift(ticketData);
        }
    } catch (err) {
        console.error("Zod Validation Failed on WS Payload:", err);
        // try re-fetching clean data from the API
        refresh();
    }
}

onMounted(() => {
    $echo
        .channel("tickets")
        .listen(".ticket.updated", (event: { ticket: unknown }) => {
            console.log("WS event [.ticket.updated]:", event);
            handleTicketUpsert(event.ticket);
        })
        .listen(".ticket.created", (event: { ticket: unknown }) => {
            console.log("WS event [.ticket.created]:", event);
            handleTicketUpsert(event.ticket);
        });
});

onUnmounted(() => {
    $echo.leaveChannel("tickets");
});
</script>

<template>
    <div
        class="card max-w-xl bg-base-100 shadow-sm border border-base-200 flex justify-between items-center"
    >
        <div class="card-body">
            <div v-if="status === 'pending'" class="flex justify-center p-8">
                <span class="loading loading-spinner loading-md"></span>
            </div>

            <div v-else-if="error" class="alert alert-error">
                <span>Error loading tickets: {{ error.message }}</span>
            </div>

            <div v-else class="space-y-4">
                <div
                    v-for="ticket in tickets"
                    :key="ticket.id"
                    class="p-4 bg-base-200/50 rounded-lg space-y-2"
                >
                    <!-- Status Badges -->
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-sm"
                            >Ticket #{{ ticket.id }}</span
                        >

                        <div
                            v-if="ticket.status === 'solved'"
                            class="badge badge-success gap-1 text-white"
                        >
                            Solved
                        </div>
                        <div
                            v-else-if="ticket.status === 'assigned'"
                            class="badge badge-warning gap-1"
                        >
                            Being Maintained
                        </div>
                        <div v-else class="badge badge-error gap-1 text-white">
                            Pending
                        </div>
                    </div>

                    <div class="text-sm space-y-1">
                        <p>
                            <strong>Node Location:</strong>
                            {{
                                ticket.node?.location ??
                                `Node #${ticket.node_id}`
                            }}
                        </p>
                        <p>
                            <strong>Assignee:</strong>
                            <span v-if="ticket.assignee">
                                {{ ticket.assignee.firstname }}
                                {{ ticket.assignee.lastname }}
                            </span>
                            <span v-else class="text-base-content/60 italic"
                                >Unassigned</span
                            >
                        </p>
                    </div>

                    <!-- Pass current ticket into openModal -->
                    <button class="btn btn-outline" @click="openModal(ticket)">
                        More...
                    </button>
                </div>
            </div>
        </div>

        <TicketModal ref="modalRef" :ticket="selectedTicket" />
    </div>
</template>
