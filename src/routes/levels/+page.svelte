<script lang="ts">
    import { Collection } from "sveltefire";
</script>

<Collection ref={"/levels"} let:data let:count>
    <span>{count} Levels</span>
    {#each data as level}
        <span>{level.levelId}</span>
        <button
            class="btn btn-error"
            on:click={async () => {
                const r = await fetch(`/api/levels/${level.levelId}`, {
                    method: "DELETE",
                });
                if (r.ok) {
                    console.log("deleted");
                }
            }}>DELETE</button
        >
    {/each}
</Collection>
