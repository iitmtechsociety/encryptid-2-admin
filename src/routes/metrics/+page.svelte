<script lang="ts">
    import { BarChart, CircleSlash2, Medal, PersonStanding } from 'lucide-svelte';
    import {firestore} from '$lib/firebase';
import { Doc, docStore } from 'sveltefire';

    // $: (doc) => {
    //     let usersByLevel: Map<String,Number> = doc?.data?.usersByLevel;
    //         let newdataSource = {
    //     "chart": {
    //         "caption": "Users by Level",
    //         "theme": "fusion"
    //     },
    //     "data": []
    // }
    //     usersByLevel.forEach((value: Number, key: String) => newdataSource.data.push({
    //         "label": `Level ${key}`,
    //         "value": value
    //     }));
        
    
</script>

<Doc ref='index/metrics' let:data>
    <span class="loading loading-spinner loading-lg" slot="loading"/>
    <div class="stats shadow">
        
        <div class="stat">
          <div class="stat-figure text-secondary">
            <PersonStanding size="40px"/>
          </div>
          <div class="stat-title">Users</div>
          <div class="stat-value">{data.userCount}</div>
          
          <div class="stat-desc">December 16 - Today</div>
        </div>
        
        <div class="stat">
          <div class="stat-figure text-secondary">
            <Medal size="40px"/>
          </div>
          <div class="stat-title">Levels</div>
          <div class="stat-value">{data.levels}</div>
          <div class="stat-desc">{data.levels * 100} Points</div>
        </div>
        
        <div class="stat">
          <div class="stat-figure text-secondary">
            <CircleSlash2 size="40px"/>
          </div>
          <div class="stat-title">Banned Users</div>
          <div class="stat-value">{data.banned}</div>
          <div class="stat-desc">skill issue</div>
        </div>
        
      </div>
      <!-- <SvelteFC {...chartConfig} /> -->
</Doc>