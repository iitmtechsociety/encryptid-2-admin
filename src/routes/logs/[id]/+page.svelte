<script lang="ts">
    import type { PageData } from "../$types";
    export let data: PageData;
    import { firestore } from "$lib/firebase";
    import { collection, where, query, orderBy } from "firebase/firestore";

    import { collectionStore } from "sveltefire";
    const logsCollection = collection(firestore, "logs");
    const q = query(
        logsCollection,
        where("userId", "==", data.userId),
        orderBy("timestamp", "desc"),
    );
    const userLogs = collectionStore(firestore, q);
</script>

{#each $userLogs as log}
    <span>log['userId']</span>
{/each}
