<script lang="ts">
  import type { GameState } from '../core/types';

  let { gameState }: { gameState: GameState | null } = $props();
</script>

<div class="campaign-header">
  <div class="stat-box">
    <div class="stat-label">DAY / SLOT</div>
    <div class="stat-value">
      {#if gameState}
        D{gameState.currentDay} . {gameState.currentSlot.toUpperCase()}
      {:else}
        -- . --
      {/if}
    </div>
  </div>
  <div class="stat-box">
    <div class="stat-label">YOUR BILL</div>
    <div class="stat-value">
      {#if gameState}
        Z.B. {gameState.playerBill.number}: {gameState.playerBill.name}
      {:else}
        --
      {/if}
    </div>
  </div>
  <div class="stat-box">
    <div class="stat-label">WAR CHEST</div>
    <div class="stat-value safe">
      {#if gameState}
        ${gameState.warChest.toLocaleString()}
      {:else}
        $--
      {/if}
    </div>
  </div>
  <div class="stat-box primary-box">
    <div class="stat-label">PRIMARY THREAT</div>
    <div class="stat-value" class:danger={gameState ? gameState.primaryThreat > 50 : false}>
      {#if gameState}
        {gameState.primaryThreat} / 70
        <div class="primary-bar-track">
          <div
            class="primary-bar-fill"
            class:hot={gameState.primaryThreat > 50}
            style="width: {(gameState.primaryThreat / 70) * 100}%"
          ></div>
        </div>
      {:else}
        -- / 70
      {/if}
    </div>
  </div>
  <div class="stat-box">
    <div class="stat-label">PRIMARY IN</div>
    <div class="stat-value danger">
      {#if gameState}
        {#if gameState.primarySurvived}
          SURVIVED
        {:else}
          T-{(gameState.primaryDate === 'early' ? 20 : 45) - gameState.currentDay} DAYS
        {/if}
      {:else}
        --
      {/if}
    </div>
  </div>
  <div class="stat-box">
    <div class="stat-label">WEEK</div>
    <div class="stat-value">
      {#if gameState}
        {Math.ceil(gameState.currentDay / 5)} OF 12
      {:else}
        -- OF 12
      {/if}
    </div>
  </div>
</div>
