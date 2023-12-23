<script lang="ts">
    import { Collection } from "sveltefire";

    
</script>
<Collection ref={'/levels'} let:data let:count>
    <span>{count} Levels</span>
    {#each data as level}
        <span>{level.levelId}</span>
    {/each}
</Collection>