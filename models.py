class Vehicle:
    def __init__(self, vehicle_id, owner_name, registration_no, make, model, year, vin):
        self.vehicle_id = vehicle_id
        self.owner_name = owner_name
        self.registration_no = registration_no
        self.make = make
        self.model = model
        self.year = year
        self.vin = vin


class Policy:
    def __init__(self, policy_id, vehicle_id, holder_name, start_date, end_date, premium, coverage_type):
        self.policy_id = policy_id
        self.vehicle_id = vehicle_id
        self.holder_name = holder_name
        self.start_date = start_date
        self.end_date = end_date
        self.premium = premium
        self.coverage_type = coverage_type


class Claim:
    def __init__(self, claim_id, policy_id, vehicle_id, claim_date, damage_description, amount, status, fraud_flag):
        self.claim_id = claim_id
        self.policy_id = policy_id
        self.vehicle_id = vehicle_id
        self.claim_date = claim_date
        self.damage_description = damage_description
        self.amount = amount
        self.status = status
        self.fraud_flag = fraud_flag