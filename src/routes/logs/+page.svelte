<script lang="ts">
    import { goto } from "$app/navigation";
    import { sendErrorToast } from "$lib/utils";
    import { MoveRight } from "lucide-svelte";
    import { Collection } from "sveltefire";
    let userId = undefined;
    const setUserId = (event) => {
        userId = event.target.value
            .trim()
            .replace(/\s/g, "")
            .replace(/[^a-zA-Z0-9]/g, "");
        event.target.value = userId;
    };
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">User Log Viewer</h1>
            <p class="py-6">Paste the user's id below to view their logs.</p>
            <input
                type="text"
                placeholder="userId"
                class="input input-bordered input-secondary w-full max-w-xs mb-2"
                on:input={setUserId}
            /><button
                class="btn btn-secondary"
                on:click={() => {
                    if (userId !== undefined && userId !== "") {
                        goto(`/logs/${userId}`);
                    } else {
                        sendErrorToast(
                            "Invalid User ID",
                            "Please enter a valid user ID.",
                        );
                    }
                }}>Go <MoveRight /></button
            >
        </div>
    </div>
</div>
