from functools import lru_cache
from langchain_upstage import ChatUpstage
from utils.config import UPSTAGE_API_KEY


@lru_cache(maxsize=1)
def get_solar_mini():
    return ChatUpstage(model="solar-1-mini-chat", api_key=UPSTAGE_API_KEY)


@lru_cache(maxsize=1)
def get_solar_pro():
    return ChatUpstage(model="solar-pro2", api_key=UPSTAGE_API_KEY)
