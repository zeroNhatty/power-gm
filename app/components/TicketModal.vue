<script setup lang="ts">
import type { Ticket } from '~/pages/operational/tickets.vue';

const props = defineProps<{
  ticket: Ticket | null;
}>();

// Expose the modal element to parent
const dialogRef = ref<HTMLDialogElement | null>(null);

defineExpose({
  showModal: () => dialogRef.value?.showModal(),
  close: () => dialogRef.value?.close(),
});
</script>

<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle">
    <div v-if="props.ticket" class="modal-box">
      <h3 class="text-lg font-bold">Ticket #{{ props.ticket.id }}</h3>
      
      <div class="py-4 space-y-2">
        <p><strong>Location:</strong> {{ props.ticket.node?.location ?? `Node #${props.ticket.node_id}` }}</p>
        <p><strong>Status:</strong> {{ props.ticket.status }}</p>
        <p>
          <strong>Assignee:</strong> 
          <span v-if="props.ticket.assignee">
            {{ props.ticket.assignee.firstname }} {{ props.ticket.assignee.middle_name ?? '' }} {{ props.ticket.assignee.lastname }}
          </span>
          <span v-else class="italic">Unassigned</span>
        </p>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button v-if="props.ticket.status === 'pending'" class="btn btn-primary mr-2">
            Handle Issue
          </button>
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>