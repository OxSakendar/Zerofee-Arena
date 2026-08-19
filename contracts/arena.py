# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

class ZeroFeeArena(gl.Contract):
    players: TreeMap[str, u256]
    player_scores: TreeMap[str, u256]
    last_mission_outcomes: TreeMap[str, str]
    territories_controlled: u256
    
    def __init__(self):
        self.players = TreeMap()
        self.player_scores = TreeMap()
        self.last_mission_outcomes = TreeMap()
        self.territories_controlled = u256(0)

    @gl.public.view
    def get_player_territories(self, player_id: str) -> u256:
        return self.players.get(player_id, u256(0))

    @gl.public.view
    def get_player_score(self, player_id: str) -> u256:
        return self.player_scores.get(player_id, u256(0))

    @gl.public.view
    def get_last_outcome(self, player_id: str) -> str:
        return self.last_mission_outcomes.get(player_id, "No missions attempted yet.")

    @gl.public.write
    def register_player(self, player_id: str):
        if player_id not in self.players:
            self.players[player_id] = u256(1)
            self.player_scores[player_id] = u256(100)
            self.territories_controlled += u256(1)
            self.last_mission_outcomes[player_id] = "Agent registered to ZeroFee Arena."

    @gl.public.write
    def execute_ai_turn(self, player_id: str, prompt: str) -> str:
        """
        Executes a non-deterministic AI turn on GenLayer.
        Validators execute the LLM call via gl.nondet.exec_prompt and reach consensus
        using gl.eq_principle on the non-deterministic output.
        """
        # Ensure player is registered
        if player_id not in self.players:
            self.players[player_id] = u256(1)
            self.player_scores[player_id] = u256(100)
            self.territories_controlled += u256(1)

        def non_deterministic_ai_eval():
            formatted_prompt = (
                f"You are the GenLayer AI Game Master for ZeroFee Arena, a cyberpunk strategy game. "
                f"Evaluate the player '{player_id}' performing action: '{prompt}'. "
                f"Respond ONLY with a JSON object in this exact format: "
                f'{{"success": true, "territories_gained": 1, "score_delta": 50, '
                f'"story": "A vivid 2-sentence cyberpunk mission narrative of what happened."}}'
            )
            raw_response = gl.nondet.exec_prompt(formatted_prompt, response_format="json")
            return raw_response

        # GenLayer Consensus Mechanism: Validators run the non-deterministic LLM evaluation
        # and reach consensus on the output via the Equivalence Principle.
        validated_json_str = gl.eq_principle.strict_eq(non_deterministic_ai_eval)
        
        result_data = json.loads(validated_json_str)
        
        success = result_data.get("success", True)
        territories_gained = int(result_data.get("territories_gained", 1))
        score_delta = int(result_data.get("score_delta", 50))
        story = result_data.get("story", "AI Mission Completed Successfully.")

        # Update contract state based on non-deterministic consensus result
        current_territories = self.players.get(player_id, u256(1))
        current_score = self.player_scores.get(player_id, u256(100))

        if success and territories_gained > 0:
            self.players[player_id] = current_territories + u256(territories_gained)
            self.territories_controlled += u256(territories_gained)

        if score_delta >= 0:
            self.player_scores[player_id] = current_score + u256(score_delta)
        else:
            abs_delta = u256(abs(score_delta))
            if current_score > abs_delta:
                self.player_scores[player_id] = current_score - abs_delta
            else:
                self.player_scores[player_id] = u256(0)

        formatted_outcome = f"[AI CONSENSUS VERIFIED]\nOutcome: {'SUCCESS' if success else 'FAILURE'}\nStory: {story}"
        self.last_mission_outcomes[player_id] = formatted_outcome

        return formatted_outcome

    @gl.public.write
    def evaluate_battle(self, attacker_id: str, defender_id: str, strategy: str) -> str:
        """
        Non-deterministic AI consensus battle resolution between two strategic agents.
        """
        def battle_ai_eval():
            prompt = (
                f"You are the GenLayer AI Judge. Resolve a cyberpunk battle between Attacker '{attacker_id}' "
                f"and Defender '{defender_id}' given Attacker Strategy: '{strategy}'. "
                f"Return JSON only: {{\"winner\": \"attacker/defender\", \"reasoning\": \"1 sentence tactical summary\"}}"
            )
            return gl.nondet.exec_prompt(prompt, response_format="json")

        battle_result_str = gl.eq_principle.strict_eq(battle_ai_eval)
        battle_data = json.loads(battle_result_str)
        
        winner = battle_data.get("winner", "attacker")
        reasoning = battle_data.get("reasoning", "Tactical superiority achieved.")

        if winner.lower() == "attacker":
            att_terrs = self.players.get(attacker_id, u256(1))
            self.players[attacker_id] = att_terrs + u256(1)
            def_terrs = self.players.get(defender_id, u256(1))
            if def_terrs > u256(1):
                self.players[defender_id] = def_terrs - u256(1)
            outcome = f"Attacker {attacker_id} won! {reasoning}"
        else:
            outcome = f"Defender {defender_id} repelled the assault! {reasoning}"

        self.last_mission_outcomes[attacker_id] = outcome
        return outcome
