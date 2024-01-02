<script lang="ts">
    import {
        Check,
        CheckCircle,
        CircleSlash,
        Cross,
        Expand,
        PlusCircle,
        X,
        XCircle,
    } from "lucide-svelte";
    import type { PageData } from "../$types";
    import Time from "svelte-time";
    export let data: PageData;
    import { Doc, docStore } from "sveltefire";
    import { firestore } from "$lib/firebase";
    const docStr = docStore(firestore, `users/${data.userId}`);
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
    function toDateTime(secs) {
        var t = new Date(1970, 0, 1); // Epoch
        const tzsecs = secs + 19800;
        t.setSeconds(tzsecs);

        // Set the time zone to Asia/Kolkata
        var options = { timeZone: "Asia/Kolkata" };

        // Format the date and time using toLocaleString with options
        var formattedDateTime = t.toLocaleString("en-US", options);

        return formattedDateTime;
    }
    function calculateTimeDifference(startDate, endDate) {
        // subtract the two dates
        var difference = Math.abs(endDate - startDate);
        let secDiff = difference / 10000;
        const days = Math.floor(secDiff / 60 / 60 / 24);
        secDiff -= days * 60 * 60 * 24;
        const hours = Math.floor(secDiff / 60 / 60);
        secDiff -= hours * 60 * 60;
        const minutes = Math.floor(secDiff / 60);
        secDiff -= minutes * 60;
        const seconds = Math.floor(secDiff);
        let timeDiffStr = "";
        if (days > 0) {
            timeDiffStr += `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            if (hours > 0) {
                timeDiffStr += `${hours}h ${minutes}m ${seconds}s`;
            } else {
                if (minutes > 0) {
                    timeDiffStr += `${minutes}m ${seconds}s`;
                } else {
                    timeDiffStr += `${seconds}s`;
                }
            }
        }
        return timeDiffStr;
    }
</script>

{#if $docStr == undefined}
    <center>
        <h1 class="text-3xl">User doesn't exist</h1>
    </center>
{:else}
    <center>
        <h1 class="text-3xl">
            Logs for <span class="text-secondary">{$docStr.username}</span>
        </h1>
    </center>
    <br />
    <ul class="timeline timeline-vertical">
        {#each reverseList($docStr.logs) as log, index}
            <li>
                {#if index !== 0}
                    <hr />
                {/if}
                <div class="timeline-start timeline-box">
                    <Time
                        format={"MMMM D, YYYY · h:mm A"}
                        timestamp={toDateTime(log.timestamp / 1000)}
                    ></Time>
                </div>
                <div class="timeline-middle">
                    {#if log.type === "pass"}
                        <PlusCircle class="text-success" />
                    {:else if log.type === "completed"}
                        <CheckCircle class="text-success" />
                        {:else if log.type === "ban"}
                        <CircleSlash class="text-error" />
                        {:else if log.type === "unban"}
                        <CircleSlash class="text-green" />
                    {:else}
                        <XCircle class="text-error" />
                    {/if}
                </div>
                <div class="timeline-end timeline-box">
                    {#if log.type === "pass"}
                        Advanced to Level {log.nextLevel}
                    {:else if log.type === "completed"}
                     All Levels Completed
                    {:else if log.type === "ban"}
                        Banned
                        {:else if log.type === "unban"}
                        Unbanned
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
            <!-- {#if index !== sampleLogs.length - 1}
                <div class="timeline-end font-mono">
                    {calculateTimeDifference(
                        sampleLogs[index + 1].timestamp,
                        log.timestamp,
                    )}
                </div>
            {/if} -->
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
{/if}
