# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

class ZeroFeeArena(gl.Contract):
    players: TreeMap[str, u256]
    player_scores: TreeMap[str, u256]
    last_mission_outcomes: TreeMap[str, str]
    territories_controlled: u256
    player_count: u256
    player_index: TreeMap[u256, str]

    def __init__(self):
        self.territories_controlled = u256(0)
        self.player_count = u256(0)

    @gl.public.view
    def get_player_territories(self, player_id: str) -> u256:
        pid = player_id.lower()
        return self.players.get(pid, u256(0))

    @gl.public.view
    def get_player_score(self, player_id: str) -> u256:
        pid = player_id.lower()
        return self.player_scores.get(pid, u256(0))

    @gl.public.view
    def get_last_outcome(self, player_id: str) -> str:
        pid = player_id.lower()
        return self.last_mission_outcomes.get(pid, "No missions attempted yet.")

    @gl.public.view
    def get_player_count(self) -> u256:
        return self.player_count

    @gl.public.view
    def get_total_territories(self) -> u256:
        return self.territories_controlled

    @gl.public.view
    def get_leaderboard(self) -> str:
        """
        Returns a JSON string containing all registered agents, their territories, scores, and ranks.
        """
        result = []
        count = int(self.player_count)
        for i in range(count):
            pid = self.player_index.get(u256(i), "")
            if pid:
                terrs = int(self.players.get(pid, u256(0)))
                sc = int(self.player_scores.get(pid, u256(0)))
                outcome = self.last_mission_outcomes.get(pid, "Agent Active.")
                result.append({
                    "address": pid,
                    "territories": terrs,
                    "score": sc,
                    "last_outcome": outcome
                })
        
        # Sort by score descending
        result.sort(key=lambda x: x["score"], reverse=True)
        return json.dumps(result)

    @gl.public.view
    def get_world_sectors(self) -> str:
        """
        Returns JSON mapping world map sectors to contract state.
        """
        sector_names = [
            {"id": "neo-tokyo", "name": "Neo Tokyo Sector", "coords": {"x": "75%", "y": "35%"}},
            {"id": "under-london", "name": "Under London Grid", "coords": {"x": "45%", "y": "25%"}},
            {"id": "amazonia-hive", "name": "Amazonia Data Hive", "coords": {"x": "35%", "y": "65%"}},
            {"id": "arctic-vault", "name": "Arctic Seed Vault", "coords": {"x": "55%", "y": "15%"}},
            {"id": "orbital-station", "name": "Orbital Station Zero", "coords": {"x": "20%", "y": "20%"}},
            {"id": "shanghai-nexus", "name": "Shanghai Cyber Nexus", "coords": {"x": "80%", "y": "50%"}},
        ]
        
        count = int(self.player_count)
        assigned_sectors = []
        
        for idx, sec in enumerate(sector_names):
            if count > 0:
                controller_pid = self.player_index.get(u256(idx % count), "")
                terrs = int(self.players.get(controller_pid, u256(0))) if controller_pid else 0
                sc = int(self.player_scores.get(controller_pid, u256(0))) if controller_pid else 0
            else:
                controller_pid = ""
                terrs = 0
                sc = 0
            
            assigned_sectors.append({
                "id": sec["id"],
                "name": sec["name"],
                "x": sec["coords"]["x"],
                "y": sec["coords"]["y"],
                "controller": controller_pid,
                "territories": terrs,
                "score": sc,
                "status": "Controlled" if controller_pid else "Uncharted"
            })
            
        return json.dumps({
            "total_territories": int(self.territories_controlled),
            "total_agents": count,
            "sectors": assigned_sectors
        })

    def _internal_register(self, pid: str):
        if pid not in self.players:
            self.players[pid] = u256(1)
            self.player_scores[pid] = u256(100)
            self.player_index[self.player_count] = pid
            self.player_count += u256(1)
            self.territories_controlled += u256(1)
            self.last_mission_outcomes[pid] = "Agent registered to ZeroFee Arena."

    @gl.public.write
    def register_player(self):
        """
        Registers the transaction sender (gl.message.sender) as an active agent.
        Uses authenticated identity rather than caller-supplied string.
        """
        sender = str(gl.message.sender).lower()
        self._internal_register(sender)

    @gl.public.write
    def execute_ai_turn(self, prompt: str) -> str:
        """
        Executes a non-deterministic AI turn for the authenticated transaction sender.
        Strict JSON validation and rule bounds are enforced across validator consensus.
        """
        sender = str(gl.message.sender).lower()
        self._internal_register(sender)

        clean_prompt = prompt.strip() if prompt else "Standard patrol mission"

        def non_deterministic_ai_eval():
            formatted_prompt = (
                f"You are the GenLayer AI Game Master for ZeroFee Arena, a cyberpunk strategy game. "
                f"Evaluate agent '{sender}' performing strategy/action: '{clean_prompt}'. "
                f"Assess whether the plan is sound, tactical, and plausible in a cyberpunk universe. "
                f"Return ONLY valid JSON matching this schema exactly: "
                f'{{"success": true, "territories_gained": 1, "score_delta": 30, '
                f'"story": "2 sentence cyberpunk mission narrative describing tactical execution."}}'
            )
            raw_response = gl.nondet.exec_prompt(formatted_prompt, response_format="json")
            try:
                data = json.loads(raw_response)
                is_success = bool(data.get("success", False))
                tg = int(data.get("territories_gained", 0))
                sd = int(data.get("score_delta", 0))
                story_text = str(data.get("story", "")).strip()

                # Rule enforcement: cap boundaries
                if tg < 0:
                    tg = 0
                if tg > 1:
                    tg = 1
                
                if sd > 50:
                    sd = 50
                if sd < -30:
                    sd = -30

                if not story_text:
                    story_text = "Mission completed under GenVM validator surveillance."

                if not is_success:
                    tg = 0
                    if sd > 0:
                        sd = -15

                return json.dumps({
                    "success": is_success,
                    "territories_gained": tg,
                    "score_delta": sd,
                    "story": story_text
                })
            except Exception as e:
                # Rule-bound fallback: Parsing failure means mission failure (NOT auto success)
                return json.dumps({
                    "success": False,
                    "territories_gained": 0,
                    "score_delta": -10,
                    "story": "Tactical link failed: Invalid mission parameters detected during GenVM validation."
                })

        # GenLayer Consensus: Equivalence principle strict equality check
        validated_json_str = gl.eq_principle.strict_eq(non_deterministic_ai_eval)
        result_data = json.loads(validated_json_str)

        success = bool(result_data.get("success", False))
        territories_gained = int(result_data.get("territories_gained", 0))
        score_delta = int(result_data.get("score_delta", 0))
        story = result_data.get("story", "Mission complete.")

        # Update contract state based on consensus outcome
        current_territories = self.players.get(sender, u256(1))
        current_score = self.player_scores.get(sender, u256(100))

        if success and territories_gained > 0:
            self.players[sender] = current_territories + u256(territories_gained)
            self.territories_controlled += u256(territories_gained)

        if score_delta >= 0:
            self.player_scores[sender] = current_score + u256(score_delta)
        else:
            abs_delta = u256(abs(score_delta))
            if current_score > abs_delta:
                self.player_scores[sender] = current_score - abs_delta
            else:
                self.player_scores[sender] = u256(0)

        formatted_outcome = f"[AI CONSENSUS VERIFIED]\nOutcome: {'SUCCESS' if success else 'FAILURE'}\nTerritories Gained: +{territories_gained}\nScore Delta: {score_delta:+d}\nStory: {story}"
        self.last_mission_outcomes[sender] = formatted_outcome

        return formatted_outcome

    @gl.public.write
    def evaluate_battle(self, defender_id: str, strategy: str) -> str:
        """
        Executes a PvP battle resolution between authenticated sender (attacker) and defender_id.
        Enforces rule-bound validation, territory capture, and score transfer.
        """
        attacker = str(gl.message.sender).lower()
        defender = defender_id.lower()

        # Enforce rule bounds:
        self._internal_register(attacker)

        if attacker == defender:
            error_msg = "[BATTLE REJECTED] You cannot battle yourself."
            self.last_mission_outcomes[attacker] = error_msg
            return error_msg

        if defender not in self.players:
            error_msg = f"[BATTLE REJECTED] Target agent '{defender}' is not registered on-chain."
            self.last_mission_outcomes[attacker] = error_msg
            return error_msg

        att_terrs = self.players.get(attacker, u256(1))
        def_terrs = self.players.get(defender, u256(1))
        att_score = self.player_scores.get(attacker, u256(100))
        def_score = self.player_scores.get(defender, u256(100))

        clean_strat = strategy.strip() if strategy else "Direct cyber assault"

        def battle_ai_eval():
            prompt = (
                f"You are the GenLayer AI Battle Judge. Resolve a cyberpunk territory combat between "
                f"Attacker '{attacker}' (Territories: {att_terrs}, Score: {att_score}) "
                f"and Defender '{defender}' (Territories: {def_terrs}, Score: {def_score}). "
                f"Attacker Strategy: '{clean_strat}'. "
                f"Evaluate tactical advantage and return ONLY JSON: "
                f'{{"winner": "attacker", "reasoning": "1 sentence battle breakdown.", "score_transfer": 25}}'
            )
            raw_res = gl.nondet.exec_prompt(prompt, response_format="json")
            try:
                b_data = json.loads(raw_res)
                win = str(b_data.get("winner", "defender")).lower()
                if win not in ["attacker", "defender"]:
                    win = "defender"
                reason = str(b_data.get("reasoning", "Tactical defense held ground.")).strip()
                st = int(b_data.get("score_transfer", 20))
                if st < 5:
                    st = 5
                if st > 40:
                    st = 40
                return json.dumps({"winner": win, "reasoning": reason, "score_transfer": st})
            except Exception:
                # Rule-bound fallback: parsing failure means defender repels invalid assault
                return json.dumps({
                    "winner": "defender",
                    "reasoning": "Assault failed due to corrupt battle vector signal.",
                    "score_transfer": 15
                })

        battle_result_str = gl.eq_principle.strict_eq(battle_ai_eval)
        battle_data = json.loads(battle_result_str)

        winner = battle_data.get("winner", "defender")
        reasoning = battle_data.get("reasoning", "Battle resolved by GenVM consensus.")
        score_transfer = u256(battle_data.get("score_transfer", 20))

        if winner == "attacker":
            # Transfer 1 territory from defender if defender has more than 1
            if def_terrs > u256(1):
                self.players[defender] = def_terrs - u256(1)
                self.players[attacker] = att_terrs + u256(1)
                terrs_stolen = 1
            else:
                self.players[attacker] = att_terrs + u256(1)
                self.territories_controlled += u256(1)
                terrs_stolen = 1

            # Transfer score
            actual_st = min(def_score, score_transfer)
            self.player_scores[defender] = def_score - actual_st
            self.player_scores[attacker] = att_score + actual_st

            outcome = f"[VICTORY] Attacker {attacker[:8]} conquered sector from {defender[:8]}! Captured: +{terrs_stolen} territory, +{actual_st} score. Detail: {reasoning}"
            def_outcome = f"[DEFENSE BREACHED] Agent {attacker[:8]} seized sector from you. Detail: {reasoning}"
        else:
            # Defender won
            actual_st = min(att_score, score_transfer)
            self.player_scores[attacker] = att_score - actual_st
            self.player_scores[defender] = def_score + actual_st

            outcome = f"[DEFEAT] Defender {defender[:8]} repelled assault by {attacker[:8]}. Lost: -{actual_st} score. Detail: {reasoning}"
            def_outcome = f"[DEFENSE SUCCESSFUL] Successfully repelled assault by Agent {attacker[:8]}. Earned: +{actual_st} score. Detail: {reasoning}"

        self.last_mission_outcomes[attacker] = outcome
        self.last_mission_outcomes[defender] = def_outcome
        return outcome

