<script lang="ts">
  import type { GameState, Faction, ReportCard, ReportCardGrade } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';

  let { gameState, onClose }: { gameState: GameState; onClose: () => void } = $props();

  function getIssueName(issue: string): string {
    return ISSUE_LABELS[issue as keyof typeof ISSUE_LABELS] ?? issue;
  }

  function getReportCard(factionId: string): ReportCard | undefined {
    return gameState.reportCards.find(rc => rc.entityId === factionId && rc.entityType === 'faction');
  }

  function gradeLabel(grade: ReportCardGrade): string {
    const labels: Record<ReportCardGrade, string> = {
      a_plus: 'A+', a: 'A', b: 'B', c: 'C', d: 'D', f: 'F',
    };
    return labels[grade] ?? '?';
  }

  function gradeColor(grade: ReportCardGrade): string {
    if (grade === 'a_plus' || grade === 'a') return 'var(--phosphor-green, #00aa00)';
    if (grade === 'b') return 'var(--marble-dark, #444444)';
    if (grade === 'c') return 'var(--warm-amber, #cc8800)';
    return 'var(--primary-red, #aa0000)';
  }

  function getPayoutAmount(rc: ReportCard, faction: Faction): number | null {
    if (!rc.isPublished) return null;
    if (faction.isBananaLobby) {
      if (rc.grade === 'a_plus') return 650;
      if (rc.grade === 'a') return 400;
    } else {
      if (rc.grade === 'a_plus') return 250;
      if (rc.grade === 'a') return 150;
    }
    return null;
  }

  function getPrimaryAttack(rc: ReportCard, faction: Faction): number | null {
    if (!rc.isPublished) return null;
    if (faction.isBananaLobby) {
      if (rc.grade === 'c') return 5;
      if (rc.grade === 'd') return 8;
      if (rc.grade === 'f') return 12;
    } else {
      if (rc.grade === 'c') return 2;
      if (rc.grade === 'd') return 4;
      if (rc.grade === 'f') return 6;
    }
    return null;
  }

  let factions = $derived(gameState.factions);
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>FACTIONS REPORT</span>
    <button class="btn btn-close" onclick={onClose}>CLOSE</button>
  </div>

  <div class="factions-grid">
    {#each factions as faction (faction.id)}
      {@const rc = getReportCard(faction.id)}
      <div class="faction-card panel" class:banana={faction.isBananaLobby}>
        <div class="faction-name">{faction.name}</div>

        <div class="issue-row">
          <span class="issue-label pro">MAJOR PRO:</span>
          <span class="issue-value">{getIssueName(faction.majorPro)}</span>
        </div>
        <div class="issue-row">
          <span class="issue-label anti">MAJOR ANTI:</span>
          <span class="issue-value">{getIssueName(faction.majorAnti)}</span>
        </div>
        <div class="issue-row">
          <span class="issue-label pro-minor">MINOR PRO:</span>
          <span class="issue-value">{getIssueName(faction.minorPro)}</span>
        </div>
        <div class="issue-row">
          <span class="issue-label anti-minor">MINOR ANTI:</span>
          <span class="issue-value">{getIssueName(faction.minorAnti)}</span>
        </div>

        <div class="faction-footer">
          <div class="treasury">
            <span class="footer-label">TREASURY:</span>
            <span class="footer-value">${faction.treasury.toLocaleString()}</span>
          </div>
          <div class="grade-box">
            {#if rc && rc.isPublished}
              <span class="grade" style="color: {gradeColor(rc.grade)}">{gradeLabel(rc.grade)}</span>
              <span class="grade-pct">{Math.round(rc.percentage)}%</span>
              {#if getPayoutAmount(rc, faction) !== null}
                <span class="payout-badge">+${getPayoutAmount(rc, faction)}/WK</span>
              {/if}
              {#if getPrimaryAttack(rc, faction) !== null}
                <span class="attack-badge">+{getPrimaryAttack(rc, faction)} PRIMARY THREAT/WK</span>
              {/if}
            {:else}
              <span class="grade-unpublished">NOT YET PUBLISHED</span>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .reference-screen {
    width: 980px;
    height: 560px;
    display: flex;
    flex-direction: column;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn-close {
    padding: 2px 10px;
    font-size: 1rem;
  }
  .factions-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    padding: 10px;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .factions-grid::-webkit-scrollbar {
    display: none;
  }
  .faction-card {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  .faction-card.banana {
    border-color: var(--warm-amber);
    border-width: 4px;
  }
  .faction-name {
    background: var(--mahogany);
    color: var(--gold);
    padding: 4px 8px;
    font-size: 1.1rem;
    border-bottom: 2px solid var(--black);
    text-align: center;
    text-transform: uppercase;
  }
  .issue-row {
    display: flex;
    gap: 6px;
    padding: 2px 8px;
    font-size: 0.95rem;
    text-transform: uppercase;
  }
  .issue-label {
    flex-shrink: 0;
    width: 90px;
  }
  .issue-label.pro {
    color: #006600;
  }
  .issue-label.anti {
    color: var(--primary-red);
  }
  .issue-label.pro-minor {
    color: #006600;
    opacity: 0.7;
  }
  .issue-label.anti-minor {
    color: var(--primary-red);
    opacity: 0.7;
  }
  .issue-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--black);
    text-transform: uppercase;
  }
  .faction-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 4px 8px;
    border-top: 2px solid #999;
    margin-top: auto;
    text-transform: uppercase;
  }
  .footer-label {
    font-size: 0.9rem;
    color: #555;
  }
  .footer-value {
    font-size: 1rem;
    color: var(--black);
    font-weight: bold;
  }
  .grade-box {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
  .grade {
    font-size: 1.6rem;
    font-weight: bold;
  }
  .grade-pct {
    font-size: 0.9rem;
    color: #555;
  }
  .grade-unpublished {
    font-size: 0.85rem;
    color: #888;
    text-transform: uppercase;
  }
  .payout-badge {
    font-size: 0.8rem;
    color: var(--phosphor-green, #00aa00);
    border: 1px solid currentColor;
    padding: 0 4px;
  }
  .attack-badge {
    font-size: 0.75rem;
    color: var(--primary-red, #aa0000);
    border: 1px solid currentColor;
    padding: 0 4px;
  }
</style>
