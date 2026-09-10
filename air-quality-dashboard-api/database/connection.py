import os
import logging
from typing import Optional, Dict, Any, List

# =============================================================================
# Database Driver Import Placeholder
# Replace '<database_driver>' with your actual database client driver module:
#   from <database_driver>.cluster import Cluster, Session
#   from <database_driver>.auth import PlainTextAuthProvider
# =============================================================================
try:
    # Placeholder: Replace 'your_database_driver' with your database driver package
    from your_database_driver.cluster import Cluster, Session
    from your_database_driver.auth import PlainTextAuthProvider
except (ImportError, ModuleNotFoundError):
    import importlib
    driver_module = os.getenv("DATABASE_DRIVER_MODULE", "<database_driver>")
    try:
        _cluster_mod = importlib.import_module(f"{driver_module}.cluster")
        _auth_mod = importlib.import_module(f"{driver_module}.auth")
        Cluster = getattr(_cluster_mod, "Cluster")
        Session = getattr(_cluster_mod, "Session")
        PlainTextAuthProvider = getattr(_auth_mod, "PlainTextAuthProvider")
    except Exception:
        # Fallback placeholder stubs for distribution
        class Cluster:
            def __init__(self, *args, **kwargs): pass
            def connect(self, *args, **kwargs): return Session()
            def shutdown(self): pass

        class Session:
            def execute(self, *args, **kwargs): return []
            def prepare(self, *args, **kwargs): return None
            def shutdown(self): pass

        class PlainTextAuthProvider:
            def __init__(self, username=None, password=None): pass

logger = logging.getLogger("dashboard_api")

_cluster: Optional[Cluster] = None
_session: Optional[Session] = None


def get_auth_provider(config: Dict[str, Any]) -> Optional[PlainTextAuthProvider]:
    """Build authentication provider from configuration if credentials exist."""
    username = config.get("database_username") or config.get("db_username")
    password = config.get("database_password") or config.get("db_password")
    if username and password:
        return PlainTextAuthProvider(username=username, password=password)
    return None


def init_db(config: Dict[str, Any]) -> Session:
    """
    Initializes the database cluster connection and active session.
    """
    global _cluster, _session

    host = config.get("database_host") or config.get("db_host") or "localhost"
    raw_port = config.get("database_port") or config.get("db_port")
    try:
        port = int(raw_port)
    except (ValueError, TypeError):
        port = None
    keyspace = (
        config.get("database_keyspace")
        or config.get("keyspace")
        or "myactivekeyspace"
    )

    auth_provider = get_auth_provider(config)

    logger.info("Initializing database connection...")
    cluster_kwargs = {}
    if port is not None:
        cluster_kwargs["port"] = port
    if auth_provider:
        cluster_kwargs["auth_provider"] = auth_provider

    _cluster = Cluster([host], **cluster_kwargs)
    _session = _cluster.connect(keyspace, wait_for_all_pools=True)
    _session.execute(f"USE {keyspace}")
    logger.info("Database connection established successfully.")
    return _session


def get_session() -> Session:
    """Return the active database session."""
    if _session is None:
        raise RuntimeError("Database session is not initialized. Call init_db() first.")
    return _session


def close_db():
    """Gracefully close database session and cluster connection."""
    global _cluster, _session
    logger.info("Closing database connections...")
    if _session:
        try:
            _session.shutdown()
        except Exception as e:
            logger.warning(f"Error shutting down database session: {e}")
        _session = None

    if _cluster:
        try:
            _cluster.shutdown()
        except Exception as e:
            logger.warning(f"Error shutting down database cluster: {e}")
        _cluster = None
    logger.info("Database connections closed.")


def load_keys_cache(session: Optional[Session] = None) -> Dict[str, Any]:
    """Populate API keys cache from database."""
    sess = session or get_session()
    rows = sess.execute("SELECT key, username, imeis FROM keys")
    return {row.key: row for row in rows}


def load_imei_cache(session: Optional[Session] = None) -> List[Dict[str, Any]]:
    """Populate IMEI locations cache from database."""
    sess = session or get_session()
    rows = sess.execute("SELECT * FROM locationdatatable")
    return [row._asdict() for row in rows]
