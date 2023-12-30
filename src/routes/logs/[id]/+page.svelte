<script lang="ts">
    import {
        Check,
        CircleSlash,
        Cross,
        Expand,
        PlusCircle,
        X,
    } from "lucide-svelte";
    import type { PageData } from "../$types";
    export let data: PageData;
    import { Doc } from "sveltefire";
    const sampleLogs = [
        {
            timestamp: Date.now(),
            type: "fail",
            currentLevel: 1,
            nextLevel: undefined,
            expectedAnswer: "yeo",
            submittedAnswer: "no",
        },
        {
            timestamp: Date.now(),
            type: "fail",
            currentLevel: 1,
            nextLevel: undefined,
            expectedAnswer: "yeos",
            submittedAnswer: "no",
        },
        {
            timestamp: Date.now(),
            type: "pass",
            currentLevel: 1,
            nextLevel: 2,
            expectedAnswer: "yeo",
            submittedAnswer: "no",
        },
    ];
    const reverseList = (list) => {
        const newList = [];
        for (let i = list.length - 1; i >= 0; i--) {
            newList.push(list[i]);
        }
        return newList;
    };
</script>

<center>
    <h1 class="text-3xl">
        Logs for <span class="text-secondary">kryo</span>
    </h1>
</center>
<br />
<ul class="timeline timeline-vertical">
    {#each reverseList(sampleLogs) as log, index}
        <li>
            {#if index !== 0}
                <hr />
            {/if}
            <div class="timeline-start timeline-box">04/01/2024 • 20:00</div>
            <div class="timeline-middle">
                {#if log.type === "pass"}
                    <PlusCircle class="text-success" />
                {:else}
                    <CircleSlash class="text-error" />
                {/if}
            </div>
            <div class="timeline-end timeline-box">
                {#if log.type === "pass"}
                    Advanced to Level {log.nextLevel}
                {:else}
                    <span class="font-bold"
                        >Failed Level {log.currentLevel}</span
                    ><br />
                    Expected: <i>{log.expectedAnswer}</i><br />
                    Submitted: <i>{log.submittedAnswer}</i>
                {/if}
            </div>

            {#if index !== sampleLogs.length - 1}
                <hr />
            {/if}
        </li>
        {#if index !== sampleLogs.length - 1}
            <div class="timeline-end font-mono">0m 0s</div>
        {/if}
    {/each}
</ul>
<!-- <Doc ref={`users/${data.userId}`} let:data>
    <h1>Logs for {data.username}</h1>
    <ul>
        {#each data["logs"] as log}
            <li>
                {log}
            </li>
        {/each}
    </ul>
</Doc> -->
